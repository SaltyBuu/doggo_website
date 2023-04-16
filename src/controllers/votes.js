const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../CodeError');

module.exports = {
  async addVote(req, res) {
    /*
    #swagger.tags = ['Vote']
    #swagger.summary = 'Add a vote.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Vote information.',
        required: true,
        schema: {
            playlistId: 2,
            songId: 4,
            userid: 3,
        }
    }
    */
    if (!has(req.body, ['userId', 'playlistId', 'songId']))
      throw new CodeError('Missing parameters', 400);
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
        message: 'The vote already exists',
      });
    }
    /*
    #swagger.responses[201] = {
        description: 'Vote added.',
        schema: {
            $ref: '#/definitions/vote'
        }
    }
    #swagger.responses[400] = {
        description: 'The vote already exists.',
        schema: {
            message: 'The vote already exists',
        }
    }
      */
  },
  async removeVote(req, res) {
    /*
    #swagger.tags = ['Vote']
    #swagger.summary = 'Remove a vote.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Vote information.',
        required: true,
        schema: {
            playlistId: 2,
            songId: 4,
            userid: 3,
        }
    }
            */
    if (!has(req.body, ['userId', 'playlistId', 'songId']))
      throw new CodeError('Missing parameters', 400);
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
      message: 'Vote deleted',
      vote,
    });
    /*
    #swagger.responses[200] = {
        description: 'Vote deleted.',
        schema: {
            $ref: '#/definitions/vote'
        }
    }
    */
  },
  async updateVotesNb(req, res) {
    /*
    #swagger.tags = ['Vote']
    #swagger.summary = 'Count the number of a votes to a song and store it in the related playlistSong.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Vote information.',
        required: true,
        schema: {
            playlistId: 2,
            songId: 4,
        }
    }
    */
    if (!has(req.body, ['playlistId', 'songId']))
      throw new CodeError('Missing parameters', 400);
    console.log('playlistid:', req.body.playlistId);
    console.log('songid:', req.body.songId);
    const total = await prisma.vote.count({
      where: {
        playlistId: parseInt(req.body.playlistId),
        songId: parseInt(req.body.songId),
      },
    });
    console.log('total:', total);
    if (total != null) {
      const song = await prisma.playlistSong.update({
        where: {
          playlistId_songId: {
            playlistId: req.body.playlistId,
            songId: req.body.songId,
          },
        },
        data: {
          votesNb: total,
        },
      });
      if (song != null) {
        res.status(200).json({
          message: 'Votes updated !',
          song,
        });
      } else {
        res
          .status(400)
          .json({ message: 'Could not update the number of votes' });
      }
    } else {
      res.status(400).json({ message: 'Could not count votes' });
    }
    /*
    #swagger.responses[400] = {
        description: 'Could not update the number of votes.',
        schema: {
            message: 'Could not update the number of votes'
        }
    }
    #swagger.responses[400] = {
        description: 'Could not count vote.',
        schema: {
            message: 'Could not count votes',
        }
    }
    */
  },
};
