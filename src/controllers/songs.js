const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../CodeError');

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
    if (!has(req.body, ['name', 'album', 'artist']))
      throw new CodeError('Song was not created', 400);

    const song = await prisma.song.upsert({
      where: {
        name: req.body.name,
        artist: req.body.artist,
      },
      update: {},
      create: {
        name: req.body.name,
        artist: req.body.artist,
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
      message: 'Song deleted: ' + song.id,
    });
  },
  async editSong(req, res) {
    const song = await prisma.song.update({
      where: {
        id: req.body.id,
      },
      data: {},
    });
    res.json({
      status: true,
      song,
    });
  },
};
