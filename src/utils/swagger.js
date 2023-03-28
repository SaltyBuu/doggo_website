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
      createdAt: '2023-03-25T13:20:24.579Z',
    },
    vote: {
      playlistId: 2,
      songId: 4,
      userid: 3,
      voteDate: '2023-03-27T21:23:57.672Z',
    },
    user: {
      id: 3,
      login: 'Alfredus',
      password: 'oueoueoue67',
      mail: 'lafamille@letsgo.org',
      name: 'darksasuke',
      createdAt: '2023-03-25T13:20:24.579Z',
    },
    song: {
      id: 3,
      name: 'A blessing and a curse',
      album: 'A blessing and a curse',
      artist: 'Here come the mummies',
      thumbnail: 'http://toto.png',
      createdAt: '2023-03-25T13:20:24.579Z',
    },
    results: [
      {
        playlistId: 1,
        songId: 1,
        votesNb: null,
        submitterId: null,
        createdAt: '2023-03-28T16:33:53.772Z',
        song: {
          id: 1,
          name: 'A Blessing And A Curse',
          album: 'Future Worlds',
          artist: 'Atomica Music',
          thumbnail:
            'https://i.scdn.co/image/ab67616d00004851ea6d794f7e1c9b2fb8b73890',
          createdAt: '2023-03-26T11:35:29.102Z',
        },
      },
    ],
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
