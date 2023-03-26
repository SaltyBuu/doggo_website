const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../CodeError');

//TODO doc api
module.exports = {
  async searchSong(req, res) {
    /*
    #swagger.tags = ['Playlist song']
    #swagger.summary = 'Find a song in a playlist.'
    #swagger.parameters['playlistId'] = {
        in: 'path',
        description: 'Id of a playlist',
        required: true,
        type: 'integer',
        schema: { $playlistId: 4 }
    }
    #swagger.parameters['songId'] = {
        in: 'path',
        description: 'Id of a song.',
        required: true,
        type: 'integer',
        schema: { $songId: 13 }
    }
    */
    //TODO id validation
    if (!has(req.params, ['playlistId', 'songId']))
      throw new CodeError('Missing parameters', 400);
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
        message: 'The song was found !',
        playlistSong,
      });
    } else {
      res.status(404).json({
        message: 'Song not found',
      });
    }
    /*
      #swagger.responses[200] = {
          description: 'Song found.',
          schema: {
            $ref: '#/definitions/playlistSong
          }
      }
      #swagger.responses[404] = {
          description: 'Song not found.',
          schema: {
            message: 'Song not found',
          }
      }
      */
  },
  async addSong(req, res) {
    /*
    #swagger.tags = ['Playlist song']
    #swagger.summary = 'Add a song in a playlist.'
    #swagger.parameters['playlistId'] = {
        in: 'path',
        description: 'Id of a playlist',
        required: true,
        type: 'integer',
    }
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Song ID, user ID and votesNB.',
        required: true,
        schema: {
            $songId: 13,
            votesNb: 3,
            submitterId: 7
        }
    }
    */
    //TODO id validation
    if (!has(req.body, ['songId']))
      throw new CodeError('Missing parameter', 400);
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
      'playlistid: ',
      playlistId,
      'songId:',
      songId,
      'votesNb: ',
      req.body.votesNb,
      'submitterID',
      req.body.submitterId
    );
    if (searchedSong === null) {
      const song = await prisma.playlistSong.create({
        data: {
          playlistId: playlistId,
          songId: songId,
          votesNb: req.body.votesNb || undefined,
          submitterId: req.body.submitterId || undefined,
        },
      });
      res.status(201).json({
        message: 'The song was added !',
        song,
      });
    } else {
      res.status(400).json({
        message: 'The song already exists',
      });
    }
    /*
      #swagger.responses[201] = {
          description: 'Song added.',
          schema: {
              message: 'The song was added",
              $ref: '#/definitions/playlistSong
          }
      }
      #swagger.responses[400] = {
          description: 'Song already exists.',
          schema: {
              message: 'The song already exists'
          }
      }
      */
  },
  async removeSong(req, res) {
    /*
    #swagger.tags = ['Playlist song']
    #swagger.summary = 'Remove a song in a playlist.'
    #swagger.parameters['playlistId'] = {
        in: 'path',
        description: 'Id of a playlist',
        required: true,
        type: 'integer',
    }
    #swagger.parameters['songId'] = {
        in: 'path',
        description: 'Id of a song.',
        required: true,
        type: 'integer',
    }
    */

    //TODO id validation
    //TODO Email validation
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseInt(req.params.playlistId);
    const song = await prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId: playlistId,
          songId: songId,
        },
      },
    });
    // const message = vote === null ? 'Vote created' + vote : '';
    res.status(200).json({
      message: 'Song deleted',
      song,
    });
    /*
    #swagger.responses[200] = {
        description: 'Song deleted.',
        schema: {
            message: 'Song deleted",
            $ref: '#/definitions/playlistSong
        }
    }
    */
  },
  async editSong(req, res) {
    /*
    #swagger.tags = ['Playlist song']
    #swagger.summary = 'Update a song in a playlist.'
    #swagger.parameters['playlistId'] = {
        in: 'path',
        description: 'Id of a playlist',
        required: true,
        type: 'integer',
    }
    #swagger.parameters['songId'] = {
        in: 'path',
        description: 'Id of a song.',
        required: true,
        type: 'integer',
    }
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Total of song's votes and submitter.',
        schema: {
            votesNb: 13,
            submitterId: 13
        }
    }
    */
    const playlistId = req.params.playlistId;
    const songId = req.params.songId;
    const song = await prisma.playlistSong.update({
      where: {
        playlistId_songId: {
          playlistId: playlistId,
          songId: songId,
        },
      },
      data: {
        votesNb: req.body.votesNb || undefined,
        submitterId: req.body.submitterId || undefined,
      },
    });
    res.status(200).json({
      message: 'Song updated',
      song,
    });
    // #swagger.responses[200] = {
    //     description: 'Song updated.',
    //     schema: {
    //         message: 'Song updated",
    //         $ref: '#/definitions/playlistSong
    //     }
    // }
  },
  async getSongs(req, res) {
    // #swagger.tags = ['Playlist song']
    // #swagger.summary = 'Get all songs in a playlist.'
    // #swagger.parameters['playlistId'] = {
    //     in: 'path',
    //     description: 'Id of a playlist',
    //     required: true,
    //     type: 'integer',
    // }

    const playlistId = parseInt(req.params.playlistId);
    const results = await prisma.playlistSong.findMany({
      where: {
        playlistId: playlistId,
      },
      include: {
        song: true,
      },
      orderBy: {
        votesNb: 'desc',
      },
    });
    res.status(200).json({
      message: 'Song(s) found !',
      results,
    });
    // #swagger.responses[200] = {
    //     description: 'Song(s) found.',
    //     schema: {
    //         message: 'Song(s) found !",
    //     }
    // }

    //TODO finish results format
  },
};
