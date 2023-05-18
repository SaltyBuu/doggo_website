const has = require('has-keys');
const CodeError = require('../CodeError');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let appToken = undefined;
let userToken = undefined;
let refreshToken = undefined;
let refreshExpiration = undefined;
const { CLIENTID, CLIENTSECRET, DEFAULT_PLAYLIST_ID, FRONT, BACK } = process.env;
const { getSpotifyToken, getRefreshedSpotifyToken } = require('../utils/spotify-token');

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
    if (!has(req.body, ['name'])) throw new CodeError('The song name is missing', 400);
    const songName = req.body.name;

    // Retrieve spotify token if undefined
    if (appToken === undefined)
      appToken = await getSpotifyToken(CLIENTID, CLIENTSECRET).catch((error) =>
        console.error(error)
      );

    // Build track search request
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      songName
    )}&type=track&market=FR&limit=10`;
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${appToken}`,
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
          appToken = accepted.access_token;
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
  // async exportPlaylistCsv(req, res) {
  //   /*
  //   #swagger.tags = ['Export']
  //   #swagger.summary = 'Export songs of the specified playlist as a csv file.'
  //   #swagger.parameters['playlistid'] = {
  //     in: 'query',
  //     description: 'Id of the playlist',
  //     required: true,
  //     type: 'int'
  //   }
  //   */
  //   if (!has(req.params, ['playlistid'])) throw new CodeError('The playlistid is missing', 400);
  //   console.log('Csv export');
  //   const playlistid = parseInt(req.params.playlistid);
  //   // Retrieve spotify token if undefined
  //   if (appToken === undefined)
  //     appToken = await getSpotifyToken(CLIENTID, CLIENTSECRET).catch((error) =>
  //       console.error(error)
  //     );
  //   // Build playlist export request
  //   const url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(
  //     DEFAULT_PLAYLIST_ID
  //   )}/tracks`;
  //
  //   const uris = [];
  //   const songs = await prisma.playlistSong.findMany({
  //     where: {
  //       playlistId: playlistid,
  //     },
  //     select: {
  //       song: {
  //         select: {
  //           uri: true,
  //           name: true,
  //         },
  //       },
  //     },
  //   });
  //   songs.forEach((s) => uris.push(s.song.uri));
  //   console.log('All songs from playlist', songs);
  //   console.log('All uris from playlist', uris);
  //
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${appToken}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(uris),
  //   };
  //   console.log('Spotify request:', requestOptions);
  //   const created = await fetch(url, requestOptions);
  //   console.log('Result:', created);
  //   if (created.status === 201) {
  //     res.status(201).json({ message: 'Songs exported' });
  //   } else {
  //     res.status(500).json({ message: 'Songs could not be exported' });
  //     console.log(await created.json());
  //   }
  //   /*
  //  #swagger.responses[201] = {
  //    description: 'Songs exported.',
  //  }
  //  #swagger.responses[500] = {
  //    description: 'Export failed.',
  //    schema: {
  //      message: 'Songs could not be exported',
  //    }
  //  }
  //  */
  // },
  async spotifyLogin(req, res) {
    const client_id = CLIENTID;
    // const redirect_uri = "https://api-doggo.herokuapp.com/callback";
    const redirect_uri = BACK + '/callback';
    // const state = generateRandomString(16);
    const scope =
      'user-read-private user-read-email playlist-modify-public playlist-modify-private';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      // state: state,
    });
    console.log('Spotify Params', params.toString());

    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
  },
  async getUserToken(req, res) {
    const code = req.query.code || null;
    if (code === null) {
      res.status(403).json({ message: 'Authorization failed' + req.query.error });
      // res.redirect('https;//doggo.wf/cynthia.html');
      return;
    }
    console.log('Authentication url request');
    const url = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams();
    body.append('code', code);
    body.append('redirect_uri', FRONT + '/callback');
    body.append('grant_type', 'authorization_code');
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + new Buffer.from(CLIENTID + ':' + CLIENTSECRET).toString('base64'),
      },
      body: body,
    };
    console.log('Fetch', authOptions);
    const response = await fetch(url, authOptions);
    console.log('Status:', response.status);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      userToken = data.access_token;
      refreshToken = data.refresh_token;
      refreshExpiration = Math.round(Date.now() / 1000) + data.expires_in;
    }
    res.redirect(FRONT + '/cynthia.html');
  },
  async exportPlaylist(req, res) {
    /*
    #swagger.tags = ['Export']
    #swagger.summary = 'Export songs of the specified playlist to a spotify playlist.'
    #swagger.parameters['playlistid'] = {
      in: 'query',
      description: 'Id of the playlist',
      required: true,
      type: 'int'
    }
    */
    if (!has(req.params, ['playlistid'])) throw new CodeError('The playlistid is missing', 400);
    console.log('Exporting to spotify');
    const playlistid = parseInt(req.params.playlistid);

    // Retrieve spotify token if undefined
    if (userToken === undefined || refreshExpiration < Math.round(Date.now() / 1000)) {
      console.log('Undefined userToken, getrefreshed');
      const data = await getRefreshedSpotifyToken(refreshToken, CLIENTID, CLIENTSECRET).catch(
        (error) => console.error(error)
      );
      if (data === null) {
        console.log('refresh token returned null');
        return;
      } else {
        userToken = data[0];
        refreshExpiration = Math.round(Date.now() / 1000) + data[1];
        console.log('userToken:', userToken);
        console.log('Expiration date:', refreshExpiration);
      }
    }

    const collaborativePlaylistId = '32Tm8u9fIrkUoJRX0q7ttu';
    // const userId = await fetch('https://api.spotify.com/v1/me', {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${userToken}`,
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((res) => {
    //     console.log(res.status);
    //     return res.json();
    //   })
    //   .then((user) => user.id);

    // Build playlist export request
    const url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(
      collaborativePlaylistId
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
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uris),
    };
    console.log('Spotify request:', requestOptions);
    const exported = await fetch(url, requestOptions);
    console.log('Result:', exported);
    if (exported.status === 201) {
      const jsonres = exported.json();
      res.status(201).json({ message: 'Songs exported', snapshot: jsonres.snapshot_id });
    } else {
      const jsonres = exported.json();
      res.status(503).json({ message: 'Songs could not be exported', error: jsonres.error });
      console.log(await exported.json());
    }
    /*
   #swagger.responses[201] = {
     description: 'Songs exported.',
     snaphost_id: 'd1e51se1s2'
   }
   #swagger.responses[503] = {
     description: 'Export failed.',
     schema: {
       message: 'Songs could not be exported',
       error: 'Error message'
     }
   }
   */
  },
};
