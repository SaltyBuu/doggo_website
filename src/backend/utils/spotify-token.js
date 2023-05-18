module.exports = {
  getSpotifyToken(clientID, clientSecret) {
    const url = 'https://accounts.spotify.com/api/token';
    const basicAuth =
      'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64');
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: basicAuth,
      },
      body: formData,
    };
    return fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          console.log('response ok');
          return response.json();
        }
        throw new Error('Cannot get access token : ' + response.status);
      })
      .then((data) => {
        console.log('return access_token:', data.access_token);
        return data.access_token;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  async getRefreshedSpotifyToken(refreshtoken, clientid, clientsecret) {
    const url = new URL('https://accounts.spotify.com/api/token');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        headers: {
          Authorization:
            'Basic ' +
            new Buffer.from(clientid + ':' + clientsecret).toString('base64'),
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshtoken,
        }),
      },
    });
    if (res.status === 200) {
      const data = res.json();
      return [data.access_token, data.expires_in];
    } else {
      return null;
    }
  },
};
