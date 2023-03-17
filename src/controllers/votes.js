const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");

module.exports = {
  async addVote(req, res) {
    if (!has(req.body, ["userId", "playlistId", "songId"]))
      throw new CodeError("Missing parameters", 400);
    //TODO Email validation
    const userId = req.body.userId;
    const playlistId = req.body.playlistId;
    const songId = req.body.songId;
    const vote = await prisma.vote.findFirst({
      where: {
        songId: songId,
        playlistId: playlistId,
        userId: userId,
      },
    });
    if (vote === null) {
      const newVote = await prisma.vote.create({
        data: {
          userId: userId,
          playlistId: playlistId,
          songId: songId,
        },
      });
      res.status(201).json({
        newVote,
      });
    } else {
      res.status(400).json({
        message: "The vote already exists",
      });
    }
  },
  async removeVote(req, res) {
    if (!has(req.body, ["userId", "playlistId", "songId"]))
      throw new CodeError("Missing parameters", 400);
    //TODO Email validation
    const userId = req.body.userId;
    const playlistId = req.body.playlistId;
    const songId = req.body.songId;
    const vote = await prisma.vote.delete({
      where: {
        songId_playlistId_userId: {
          songId: songId,
          playlistId: playlistId,
          userId: userId,
        },
      },
    });
    res.status(200).json({
      message: "Vote deleted",
      vote,
    });
  },
};
