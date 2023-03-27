const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../CodeError');

module.exports = {
  async searchSong(req, res) {
    /*
   #swagger.tags = ['Song']
   #swagger.summary = 'Find a song.'
   #swagger.parameters['name'] = {
       in: 'body',
       description: 'Name of a song',
       required: true,
       type: 'string',
   }
   #swagger.parameters['artist'] = {
       in: 'body',
       description: 'Artist of a song.',
       required: true,
       type: 'string',
   }
   */
    const song = await prisma.song.findFirst({
      where: {
        name: req.body.name,
        artist: req.body.artist,
      },
    });
    console.log(song);
    if (song != null) {
      res.status(200).json({
        message: 'Song found !',
        song,
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
            $ref: '#/definitions/song'
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
    #swagger.tags = ['Song']
    #swagger.summary = 'Find a song.'
    #swagger.parameters['name'] = {
        in: 'body',
        description: 'Name of a song',
        required: true,
        type: 'string',
    }
    #swagger.parameters['album'] = {
        in: 'body',
        description: 'Album of a song.',
        required: true,
        type: 'string',
    }
    #swagger.parameters['artist'] = {
        in: 'body',
        description: 'Artist of a song.',
        required: true,
        type: 'string',
    }
    #swagger.parameters['thumbnail'] = {
        in: 'body',
        description: 'Thumbnail of a song album.',
        required: true,
        type: 'string',
    }
    */
    console.log(req.body);
    if (!has(req.body, ['name', 'album', 'artist', 'thumbnail']))
      throw new CodeError('Missing parameters', 400);

    const name = req.body.name;
    const artist = req.body.artist;
    const song = await prisma.song.findFirst({
      where: {
        name: name,
        artist: artist,
      },
    });
    if (song === null) {
      const song = await prisma.song.create({
        data: {
          name: name,
          artist: artist,
          album: req.body.album,
          thumbnail: req.body.thumbnail,
        },
      });
      res.status(201).json({
        message: 'The song was successfully created !',
        song,
      });
    } else {
      res.status(400).json({
        message: 'The song already exists',
      });
    }
    /*
      #swagger.responses[201] = {
          description: 'Song created.',
          schema: {
            message: 'The song was successfully created !',
            $ref: '#/definitions/song'
          }
      }
      #swagger.responses[400] = {
          description: 'The song already exists.',
          schema: {
            message: 'The song already exists',
          }
      }
      */
  },
  async removeSong(req, res) {
    /*
    #swagger.tags = ['Song']
    #swagger.summary = 'Remove a song.'
    #swagger.parameters['id'] = {
        in: 'body',
        description: 'Id of a song',
        required: true,
        type: 'integer',
    }
    */
    const song = await prisma.song.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      message: 'Song deleted',
      song,
    });
    /*
    #swagger.responses[200] = {
      description: 'Song deleted.',
      schema: {
        message: 'Song deleted',
        $ref: '#/definitions/song'
      }
    }
    */
  },
  async updateSong(req, res) {
    /*
    #swagger.tags = ['Song']
    #swagger.summary = 'Update a song.'
    #swagger.parameters['id'] = {
        in: 'body',
        description: 'Id of a song',
        required: true,
        type: 'integer',
    }
    #swagger.parameters['name'] = {
        in: 'body',
        description: 'Name of a song',
        required: true,
        type: 'string',
    }
    #swagger.parameters['album'] = {
        in: 'body',
        description: 'Album of a song.',
        required: true,
        type: 'string',
    }
    #swagger.parameters['artist'] = {
        in: 'body',
        description: 'Artist of a song.',
        required: true,
        type: 'string',
    }
    */
    const song = await prisma.song.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name || undefined,
        album: req.body.album || undefined,
        artist: req.body.artist || undefined,
      },
    });
    res.status(200).json({
      message: 'Song updated',
      song,
    });
    /*
    #swagger.responses[200] = {
      description: 'Song updated.',
      schema: {
        message: 'Song updated',
        $ref: '#/definitions/song'
      }
    }
    */
  },
};
