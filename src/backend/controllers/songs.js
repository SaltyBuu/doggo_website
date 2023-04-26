const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const has = require("has-keys");
const CodeError = require("../CodeError");

module.exports = {
  async searchSong(req, res) {
    /*
   #swagger.tags = ['Song']
   #swagger.summary = 'Find a song.'
   #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Name and artist of a song',
      required: true,
      schema: {
          name: 'A blessing and a curse',
          artist: 'Here come the mummies',
      }
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
        message: "Song found !",
        song,
      });
    } else {
      res.status(404).json({
        message: "Song not found",
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
    #swagger.summary = 'Add a song.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Song information.',
        required: true,
        schema: {
            name: 'A blessing and a curse',
            album: 'A blessing and a curse',
            artist: 'Here come the mummies',
            thumbnail: 'http://toto.png',
            preview: 'https://p.scdn.co/mp3-preview/9a31543dfedda4f1109a7c6c69ca62914bf987ff?cid=774b29d4f13844c495f206cafdad9c86',
            uri: 'spotify:track:6saOAnhIoLEdWbfSEwCV2l',
        }
    }
    */
    console.log(req.body);
    if (!has(req.body, ["name", "album", "artist", "thumbnail"]))
      throw new CodeError("Missing parameters", 400);

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
          preview: req.body.preview,
          uri: req.body.uri,
        },
      });
      res.status(201).json({
        message: "The song was successfully created !",
        song,
      });
    } else {
      res.status(400).json({
        message: "The song already exists",
      });
    }
    /*
      #swagger.responses[201] = {
          description: 'Song created.',
          schema: {
            message: 'The song was successfully created !',
            song: { $ref: '#/definitions/song' }
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
      message: "Song deleted",
      song,
    });
    /*
    #swagger.responses[200] = {
      description: 'Song deleted.',
      schema: {
        message: 'Song deleted',
        song: { $ref: '#/definitions/song' }
      }
    }
    */
  },
  async updateSong(req, res) {
    /*
    #swagger.tags = ['Song']
    #swagger.summary = 'Update a song.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Song information',
        required: true,
        schema: {
            id: 3,
            name: 'A blessing and a curse',
            album: 'A blessing and a curse',
            artist: 'Here come the mummies',
            preview: 'https://p.scdn.co/mp3-preview/9a31543dfedda4f1109a7c6c69ca62914bf987ff?cid=774b29d4f13844c495f206cafdad9c86',
            uri: 'spotify:track:6saOAnhIoLEdWbfSEwCV2l',
        }
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
        preview: req.body.preview || undefined,
        uri: req.body.uri || undefined,
      },
    });
    res.status(200).json({
      message: "Song updated",
      song,
    });
    /*
    #swagger.responses[200] = {
      description: 'Song updated.',
      schema: {
        message: 'Song updated',
        song: { $ref: '#/definitions/song' }
      }
    }
    */
  },
};
