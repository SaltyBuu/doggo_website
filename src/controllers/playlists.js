const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");

module.exports = {
  async addPlaylist(req, res) {
    if (!has(req.body, ["name"]))
      throw new CodeError("The playlist name is missing", 400);
    const existing = await prisma.playlist.findFirst({
      where: { id: req.body.id },
    });
    if (existing != null) {
      const playlist = await prisma.playlist.create({
        data: {
          name: req.body.name,
        },
      });
      // const message = user === null ? 'User created' + user.name : '';
      res.status(201).json({
        playlist,
      });
    } else {
      res.status(400).json({
        message: "The playlist already exists",
      });
    }
  },
  async removePlaylist(req, res) {
    const playlist = await prisma.playlist.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      message: "Playlist deleted",
      playlist,
    });
  },
  async editPlaylist(req, res) {
    if (!has(req.body, ["name"]))
      throw new CodeError("Playlist was left intact", 400);
    const playlist = await prisma.playlist.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
      },
    });
    res.status(200).json({
      message: "Playlist updated",
      playlist,
    });
  },
};
