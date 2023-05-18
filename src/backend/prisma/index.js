const { PrismaClient } = require('@prisma/client');
const apiResults = require('../utils/spotify-request-example');
const prisma = new PrismaClient();
const results = apiResults.tracks.items.map((s) => ({
  artist: s.album.artists[0].name,
  album: s.album.name,
  name: s.name,
  thumbnail: s.album.images[s.album.images.length - 1].url, //Get smallest image url
  preview: s.preview_url,
  uri: s.uri,
}));
async function main() {
  await prisma.user.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  const user = await prisma.user.create({
    data: {
      login: 'Testiseasy',
      password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // 'test'
      mail: 'henri@hihan.io',
    },
  });
  await prisma.user.create({
    data: {
      login: 'saltybuu',
      password: '6b000be1ff75fa2ea03bded1d92c60f06d76e9304612089cd04b29986f09d03a', // 'azerty'
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
  await prisma.vote.deleteMany({});

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
    const newVote = await prisma.vote.create({
      data: {
        userId: parseInt(user.id),
        playlistId: parseInt(playlist.id),
        songId: newSong.id,
      },
    });
    console.log('newPlaylistSong', newPlaylistSong);
    console.log('newVote', newVote);
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
