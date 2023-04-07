const has = require('has-keys');
const CodeError = require('../CodeError');
let token = undefined;
const { CLIENTID, CLIENTSECRET } = process.env;
const { getToken } = require('../utils/spotify-token');

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
    if (!has(req.body, ['name']))
      throw new CodeError('The song name is missing', 400);
    const songName = req.body.name;
    if (token === undefined) token = await getToken(CLIENTID, CLIENTSECRET); // Obtient le jeton d'accès
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      songName
    )}&type=track&market=FR&limit=5`;

    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    console.log('token', token);
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.log('1');
      if (response.status === 401) {
        console.log('2');
        const newToken = await getToken(CLIENTID, CLIENTSECRET);

        const newRequestOptions = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
        };

        const newResponse = await fetch(url, newRequestOptions);

        if (newResponse.ok) {
          console.log('3');
          const accepted = newResponse.json();
          token = accepted.access_token;
        } else {
          console.log('4');
          res.status(400).json({
            message: `Erreur ${response.status} : Could not look for "${songName}"`,
          });
        }
      } else {
        console.log('5');
        res.status(400).json({
          message: `Erreur ${response.status} : Could not look for "${songName}"`,
        });
      }
    } else {
      console.log('6');
      // console.log('Response', response);
      const results = await response.json();
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
