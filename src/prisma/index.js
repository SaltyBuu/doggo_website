const { PrismaClient } = require('@prisma/client');
const apiResults = require('../public/js/spotify-request-example');
const prisma = new PrismaClient();
const results = apiResults.tracks.items.map((s) => ({
  artist: s.album.artists[0].name,
  album: s.album.name,
  name: s.name,
  thumbnail: s.album.images[s.album.images.length - 1].url, //Get smallest image url
}));
//TODO setup CI
async function main() {
  await prisma.user.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  const user = await prisma.user.create({
    data: {
      login: 'Henri',
      password:
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // 'test'
      mail: 'henri@hihan.io',
    },
  });
  await prisma.user.create({
    data: {
      login: 'saltybuu',
      password:
        'f2d81a260dea8a100dd517984e53c56a7523d96942a834b9cdc249bd4e8c7aa9', // 'azerty'
      mail: 'sal@ty.buu',
      isAdmin: true,
    },
  });
  await prisma.user.create({
    data: {
      login: 'Jess',
      password: 'testastotestato',
      mail: 'jess@hihan.io',
    },
  });

  await prisma.playlist.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE "Playlist_id_seq" RESTART WITH 1;`;
  const playlist = await prisma.playlist.create({
    data: {
      name: 'Chill playlist',
    },
  });

  const allUsers = await prisma.user.findMany();
  console.log(allUsers);

  await prisma.song.deleteMany({});
  await prisma.playlistSong.deleteMany({});

  for (const r of results) {
    console.log('Object -----------');
    console.log(r);
    const newSong = await prisma.song.create({ data: r });
    console.log(newSong);
    console.log('args:', playlist.id, user.id);
    const newPlaylistSong = await prisma.playlistSong.create({
      data: {
        songId: newSong.id,
        playlistId: parseInt(playlist.id),
        votesNb: 1,
        submitterId: parseInt(user.id),
      },
    });
    console.log(newPlaylistSong);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
