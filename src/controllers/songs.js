const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");

module.exports = {
  async searchSong(req, res) {
    const song = await prisma.song.findFirst({
      where: {
        name: req.body.name,
        artist: req.body.artist,
      },
    });
    if (song != null) {
      res.status(200).json({
        song,
      });
    } else {
      res.status(404).json({
        message: "Song not found",
      });
    }
  },
  async addSong(req, res) {
    if (!has(req.body, ["name", "album", "artist"]))
      throw new CodeError("Missing parameters", 400);

    const name = req.body.name;
    const artist = req.body.artist;
    const song = await prisma.song.findFirst({
      where: {
        name: name,
        artist: artist,
      },
    });
    if (song === null) {
      const newSong = await prisma.song.create({
        data: {
          name: name,
          artist: artist,
          album: req.body.album,
        },
      });
      res.status(201).json({
        newSong,
      });
    } else {
      res.status(400).json({
        message: "The song already exists",
      });
    }
  },
  async removeSong(req, res) {
    const song = await prisma.song.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      message: "Song deleted",
      song,
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
    res.status(200).json({
      message: "Song updated",
      song,
    });
  },
};
