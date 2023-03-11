const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../CodeError');

module.exports = {
  async searchSong(req, res) {
    //TODO id validation
    const playlistSong = await prisma.playlistSong.findFirst({
      where: {
        playlistId: req.body.playlistId,
        songId: req.body.songId,
      },
    });
    res.json({
      status: true,
      playlistSong,
    });
  },
  async addSong(req, res) {
    //TODO id validation
    if (!has(req.body, ['playlist_id', 'song_id']))
      throw new CodeError('Song was not added', 400);
    //TODO Email validation
    const playlistSong = await prisma.playlistSong.upsert({
      where: {
        playlist_id: req.body.playlist_id,
        song_id: req.body.song_id,
      },
      update: {},
      create: {
        playlist_id: req.body.playlist_id,
        song_id: req.body.song_id,
      },
    });
    // const message = vote === null ? 'Vote created' + vote : '';
    res.json({
      status: true,
      playlistSong,
    });
  },
  async removeSong(req, res) {
    //TODO id validation
    if (!has(req.body, ['playlist_id', 'song_id']))
      throw new CodeError('Song was not deleted', 400);
    //TODO Email validation
    const playlistSong = await prisma.playlistSong.delete({
      where: {
        playlist_id: req.body.playlist_id,
        song_id: req.body.song_id,
      },
    });
    // const message = vote === null ? 'Vote created' + vote : '';
    res.json({
      status: true,
      message:
        'Song deleted: ' + vote.song_id + ', Playlist: ' + vote.playlist_id,
    });
  },
  async editSong(req, res) {
    //TODO edit mechanism
    const playlistSong = await prisma.playlistSong.update({
      where: {
        playlistId: req.body.playlistId,
        songId: req.body.songId,
      },
      data: {},
    });
    res.json({
      status: true,
      playlistSong,
    });
  },
};
