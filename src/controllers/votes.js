const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");

module.exports = {
  async addVote(req, res) {
    if (!has(req.body, ["user_id", "playlist_id", "song_id"]))
      throw new CodeError("Vote was not created", 400);
    //TODO Email validation
    const user_id = req.body.user_id;
    const playlist_id = req.body.playlist_id;
    const song_id = req.body.song_id;
    const vote = await prisma.vote.findFirst({
      where: {
        songId: song_id,
        playlistId: playlist_id,
        userId: user_id,
      },
    });
    if (vote === null) {
      const newVote = await prisma.vote.create({
        data: {
          userId: user_id,
          playlistId: playlist_id,
          songId: song_id,
        },
      });
      res.status(201).json({
        newVote,
      });
    } else {
      res.status(204).json({
        message: "The vote already exists",
      });
    }
  },
  async removeVote(req, res) {
    if (!has(req.body, ["user_id", "playlist_id", "song_id"]))
      throw new CodeError("Vote was not created", 400);
    //TODO Email validation
    const user_id = req.body.user_id;
    const playlist_id = req.body.playlist_id;
    const song_id = req.body.song_id;
    const vote = await prisma.vote.delete({
      where: {
        songId_playlistId_userId: {
          songId: song_id,
          playlistId: playlist_id,
          userId: user_id,
        },
      },
    });
    res.status(200).json({
      message: "Vote deleted",
      vote,
    });
  },
};
