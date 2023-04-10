const { PrismaClient } = require('@prisma/client');
const apiResults = require('../public/base/spotify-request-example');
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
  const user = await prisma.user.create({
    data: {
      login: 'Henri',
      password: 'testastotestato',
      mail: 'henri@hihan.io',
    },
  });
  await prisma.user.create({
    data: {
      login: 'saltybuu',
      password: 'yes',
      mail: 'sal@ty.buu',
      admin: true,
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
