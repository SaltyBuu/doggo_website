const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");

module.exports = {
  async searchSong(req, res) {
    const song = await prisma.song.findFirst({
      where: {
        id: req.body.id,
      },
    });
    res.json({
      status: true,
      song,
    });
  },
  async addSong(req, res) {
    if (!has(req.body, ["name", "album", "artist"]))
      throw new CodeError("Song was not created", 400);

    const name = req.body.name;
    const artist = req.body.artist;
    const song = await prisma.song.upsert({
      where: {
        name_artist: { name, artist },
      },
      update: {},
      create: {
        name: name,
        artist: artist,
        album: req.body.album,
      },
    });
    // const message = song === null ? 'Song created' + song.login : '';
    res.json({
      status: true,
      song,
    });
  },
  async removeSong(req, res) {
    const song = await prisma.song.delete({
      where: {
        id: req.body.id,
      },
    });
    res.json({
      status: true,
      message: "Song deleted: " + song.id,
    });
  },
  async editSong(req, res) {
    const song = await prisma.song.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name || undefined,
        album: req.body.album || undefined,
        artist: req.body.artist || undefined,
      },
    });
    res.json({
      status: true,
      song,
    });
  },
};
