const has = require('has-keys');
const CodeError = require('../CodeError');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let token = undefined;
const { CLIENTID, CLIENTSECRET, DEFAULT_PLAYLIST_ID } = process.env;
const { getSpotifyToken } = require('../utils/spotify-token');

module.exports = {
  async searchApi(req, res) {
    /*
    #swagger.tags = ['Spotify search']
    #swagger.summary = 'Search songs by name.'
    #swagger.parameters['name'] = {
      in: 'body',
      description: 'Name of the song',
      required: true,
      type: 'string',
      schema: { $name: 'A blessing' }
    }
    */
    console.log('res0', res.headersSent);
    if (!has(req.body, ['name']))
      throw new CodeError('The song name is missing', 400);
    const songName = req.body.name;

    // Retrieve spotify token if undefined
    if (token === undefined)
      token = await getSpotifyToken(CLIENTID, CLIENTSECRET).catch((error) =>
        console.error(error)
      );

    // Build track search request
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      songName
    )}&type=track&market=FR&limit=10`;
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // Run search for desired song
    const resultPromise = await fetch(url, requestOptions);

    if (!resultPromise.ok) {
      // If access_token is invalid, renw it
      if (resultPromise.status === 401) {
        const newToken = await getSpotifyToken(CLIENTID, CLIENTSECRET);
        console.log('INFO Spotify access token renewal:', newToken);

        const newRequestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
        };

        // Issue song request with new token
        const newResponse = await fetch(url, newRequestOptions);
        console.log('DEBUG Spotify track request:', newResponse);

        if (newResponse.ok) {
          const accepted = newResponse.json();
          console.log('Accepted:', accepted);
          token = accepted.access_token;
        } else {
          res.status(400).json({
            message: `Erreur ${newResponse.status} : Could not look for "${songName}"`,
          });
        }
      } else {
        res.status(400).json({
          message: `Erreur ${resultPromise.status} : Could not look for "${songName}"`,
        });
      }
    } else {
      const results = await resultPromise.json();
      res.status(200).json({ results });
    }
    /*
      #swagger.responses[200] = {
        description: 'Returned list of songs.',
      }
      #swagger.responses[400] = {
        description: 'Search failed.',
        schema: {
          message: 'Could not look for "<songName>"',
        }
      }
      */
  },
  async exportPlaylist(req, res) {
    /*
    #swagger.tags = ['Export']
    #swagger.summary = 'Export songs of the specified playlist to a default collaborative playlist.'
    #swagger.parameters['playlistid'] = {
      in: 'path',
      description: 'Id of the playlist',
      required: true,
      type: 'int'
    }
    */
    if (!has(req.params, ['playlistid']))
      throw new CodeError('The playlistid is missing', 400);
    console.log('PLAYLIST EXPORT');
    const playlistid = parseInt(req.params.playlistid);
    // Retrieve spotify token if undefined
    if (token === undefined)
      token = await getSpotifyToken(CLIENTID, CLIENTSECRET).catch((error) =>
        console.error(error)
      );
    // Build playlist export request
    const url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(
      DEFAULT_PLAYLIST_ID
    )}/tracks`;

    const uris = [];
    const songs = await prisma.playlistSong.findMany({
      where: {
        playlistId: playlistid,
      },
      select: {
        song: {
          select: {
            uri: true,
            name: true,
          },
        },
      },
    });
    songs.forEach((s) => uris.push(s.song.uri));
    console.log('All songs from playlist', songs);
    console.log('All uris from playlist', uris);

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uris),
    };
    console.log('Spotify request:', requestOptions);
    const created = await fetch(url, requestOptions);
    console.log('Result:', created);
    if (created.status === 201) {
      res.status(201).json({ message: 'Songs exported' });
    } else {
      res.status(500).json({ message: 'Songs could not be exported' });
      console.log(await created.json());
    }
  },
};
