const swaggerAutogen = require('swagger-autogen')();
const doc = {
  info: {
    version: '1.0.0',
    title: 'REST API',
    description: '',
  },
  host: 'localhost:3000/api/v1',
  schemes: ['http'],
  definitions: {
    playlistSong: {
      playlistId: 1,
      songId: 14,
      votesNb: 53,
      submitterId: 2,
      createdAt: '2023-03-25 13:20:24.579',
    },
  },
};
const outputFile = 'swagger_output.json';
const endpointsFiles = [
  'src/routes/users.js',
  'src/routes/router.js',
  'src/routes/songs.js',
  'src/routes/votes.js',
  'src/routes/playlistSongs.js',
  'src/routes/playlists.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);
