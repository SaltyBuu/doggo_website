const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");

//TODO doc api
module.exports = {
  async searchSong(req, res) {
    //TODO id validation
    if (!has(req.params, ["playlistId", "songId"]))
      throw new CodeError("Missing parameters", 400);
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseInt(req.params.songId);
    const playlistSong = await prisma.playlistSong.findFirst({
      where: {
        playlistId: playlistId,
        songId: songId,
      },
    });
    if (playlistSong !== null) {
      res.status(200).json({
        message: "The song was found !",
        playlistSong,
      });
    } else {
      res.status(404).json({
        message: "Song not found",
      });
    }
  },
  async addSong(req, res) {
    //TODO id validation
    if (!has(req.body, ["songId"]))
      throw new CodeError("Missing parameter", 400);
    //TODO Email validation
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseInt(req.body.songId);
    const searchedSong = await prisma.playlistSong.findFirst({
      where: {
        playlistId: playlistId,
        songId: songId,
      },
    });
    console.log(
      "playlistid: ",
      playlistId,
      "songId:",
      songId,
      "rank: ",
      req.body.rank,
      "submitterID",
      req.body.submitterId
    );
    if (searchedSong === null) {
      const song = await prisma.playlistSong.create({
        data: {
          playlistId: playlistId,
          songId: songId,
          rank: req.body.rank || undefined,
          submitterId: req.body.submitterId || undefined,
        },
      });
      res.status(201).json({
        message: "The song was added !",
        song,
      });
    } else {
      res.status(400).json({
        message: "The song already exists",
      });
    }
  },
  async removeSong(req, res) {
    //TODO id validation
    //TODO Email validation
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseInt(req.params.playlistId);
    const playlistSong = await prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId: playlistId,
          songId: songId,
        },
      },
    });
    // const message = vote === null ? 'Vote created' + vote : '';
    res.status(200).json({
      message: "Song deleted",
      playlistSong,
    });
  },
  async editSong(req, res) {
    const playlistId = req.params.playlistId;
    const songId = req.params.songId;
    const playlistSong = await prisma.playlistSong.update({
      where: {
        playlistId_songId: {
          playlistId: playlistId,
          songId: songId,
        },
      },
      data: {
        rank: req.body.rank || undefined,
        submitterId: req.body.submitterId || undefined,
      },
    });
    res.status(200).json({
      message: "Song updated",
      playlistSong,
    });
  },
  async getSongs(req, res) {
    const playlistId = parseInt(req.params.playlistId);
    const results = await prisma.playlistSong.findMany({
      where: {
        playlistId: playlistId,
      },
      include: {
        song: true,
      },
      orderBy: {
        rank: "asc",
      },
    });
    res.status(200).json({
      message: "Song(s) found !",
      results,
    });
  },
};
