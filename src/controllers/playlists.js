const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../CodeError');

module.exports = {
  async addPlaylist(req, res) {
    if (!has(req.body, ['name']))
      throw new CodeError('Playlist was not created', 400);
    const playlist = await prisma.playlist.upsert({
      where: {
        name: req.body.name,
      },
      update: {},
      create: {
        name: req.body.name,
      },
    });
    // const message = user === null ? 'User created' + user.name : '';
    res.json({
      status: true,
      playlist,
    });
  },
  async removePlaylist(req, res) {
    const playlist = await prisma.playlist.delete({
      where: {
        id: req.body.id,
      },
    });
    res.json({
      status: true,
      message: 'playlist deleted: ' + playlist.id,
    });
  },
  async editPlaylist(req, res) {
    //TODO edit mechanism
    const playlist = await prisma.playlist.update({
      where: {
        id: req.body.id,
      },
      data: {},
    });
    res.json({
      status: true,
      playlist,
    });
  },
};
