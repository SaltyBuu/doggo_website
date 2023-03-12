const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");

module.exports = {
  async searchSong(req, res) {
    //TODO id validation
    if (!has(req.body, ["playlist_id", "song_id"]))
      throw new CodeError("Song was not added", 400);
    const playlistSong = await prisma.playlistSong.findFirst({
      where: {
        playlistId: req.body.playlist_id,
        songId: req.body.song_id,
      },
    });
    res.json({
      status: true,
      playlistSong,
    });
  },
  async addSong(req, res) {
    //TODO id validation
    if (!has(req.body, ["playlist_id", "song_id"]))
      throw new CodeError("Song was not added", 400);
    //TODO Email validation
    const playlist_id = req.body.playlist_id;
    const song_id = req.body.song_id;
    const playlistSong = await prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist_id,
          songId: song_id,
        },
      },
      update: {},
      create: {
        playlistId: playlist_id,
        songId: song_id,
        rank: req.body.rank || undefined,
        submitterId: res.body.submitter_id || undefined,
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
    if (!has(req.body, ["playlist_id", "song_id"]))
      throw new CodeError("Song was not added", 400);
    //TODO Email validation
    const playlist_id = req.body.playlist_id;
    const song_id = req.body.song_id;
    const playlistSong = await prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId: playlist_id,
          songId: song_id,
        },
      },
    });
    // const message = vote === null ? 'Vote created' + vote : '';
    res.json({
      status: true,
      playlistSong,
    });
  },
  async editSong(req, res) {
    if (!has(req.body, ["playlist_id", "song_id"]))
      throw new CodeError("Song was not edited", 400);
    const playlist_id = req.body.playlist_id;
    const song_id = req.body.song_id;
    const playlistSong = await prisma.playlistSong.update({
      where: {
        playlistId_songId: {
          playlistId: playlist_id,
          songId: song_id,
        },
      },
      data: {
        rank: req.body.rank || undefined,
        submitterId: req.body.submitter_id || undefined,
      },
    });
    res.json({
      status: true,
      playlistSong,
    });
  },
};
