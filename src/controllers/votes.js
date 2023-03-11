const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../CodeError');

module.exports = {
  async addVote(req, res) {
    if (!has(req.body, ['user_id', 'playlist_id', 'song_id']))
      throw new CodeError('Vote was not created', 400);
    //TODO Email validation
    const vote = await prisma.user.upsert({
      where: {
        user_id: req.body.user_id,
        playlist_id: req.body.playlist_id,
        song_id: req.body.song_id,
      },
      update: {},
      create: {
        user_id: req.body.user_id,
        playlist_id: req.body.playlist_id,
        song_id: req.body.song_id,
      },
    });
    // const message = vote === null ? 'Vote created' + vote : '';
    res.json({
      status: true,
      vote,
    });
  },
  async removeVote(req, res) {
    if (!has(req.body, ['user_id', 'playlist_id', 'song_id']))
      throw new CodeError('Vote was not created', 400);
    //TODO Email validation
    const vote = await prisma.user.delete({
      where: {
        user_id: req.body.user_id,
        playlist_id: req.body.playlist_id,
        song_id: req.body.song_id,
      },
    });
    // const message = vote === null ? 'Vote created' + vote : '';
    res.json({
      status: true,
      message:
        'Vote deleted, User: ' +
        vote.user_id +
        ', Song: ' +
        vote.song_id +
        ', Playlist: ' +
        vote.playlist_id,
    });
  },
};
