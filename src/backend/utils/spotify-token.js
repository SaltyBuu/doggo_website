module.exports = {
  getSpotifyToken(clientID, clientSecret) {
    const url = 'https://accounts.spotify.com/api/token';
    const basicAuth = 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64');
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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
    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshtoken);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + new Buffer.from(clientid + ':' + clientsecret).toString('base64'),
        },
        body: formData,
      },
    });
    console.log('Refreshed status', res.status);
    if (res.status === 200) {
      console.log('OK ');
      const data = await res.json();
      return [data.access_token, data.expires_in];
    } else {
      const error = await res.json();
      console.log('Refresh error:', error);
      return null;
    }
  },
};
