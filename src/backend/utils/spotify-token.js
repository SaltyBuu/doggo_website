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
};