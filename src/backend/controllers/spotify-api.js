const has = require("has-keys");
const CodeError = require("../CodeError");
let token = undefined;
const { CLIENTID, CLIENTSECRET } = process.env;
const { getSpotifyToken } = require("../utils/spotify-token");

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
    console.log("res0", res.headersSent);
    if (!has(req.body, ["name"]))
      throw new CodeError("The song name is missing", 400);
    const songName = req.body.name;

    // Retreive spotify token if undefined
    if (token === undefined)
      token = await getSpotifyToken(CLIENTID, CLIENTSECRET).catch((error) =>
        console.error(error)
      );

    // Build trach search request
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      songName
    )}&type=track&market=FR&limit=5`;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // Run search for desired song
    const resultPromise = await fetch(url, requestOptions);

    if (!resultPromise.ok) {
      // If access_token is invalid, renw it
      if (resultPromise.status === 401) {
        const newToken = await getSpotifyToken(CLIENTID, CLIENTSECRET);
        console.log("INFO Spotify access token renewal:", newToken);

        const newRequestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        };

        // Issue song request with new token
        const newResponse = await fetch(url, newRequestOptions);
        console.log("DEBUG Spotify track request:", newResponse);

        if (newResponse.ok) {
          const accepted = newResponse.json();
          console.log("Accepted:", accepted);
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
};
