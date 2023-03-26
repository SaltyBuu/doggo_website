const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const has = require('has-keys');
const CodeError = require('../CodeError');

module.exports = {
  async addPlaylist(req, res) {
    /*
    #swagger.tags = ['Playlist']
    #swagger.summary = 'Add a playlist.'
    #swagger.parameters['name'] = {
      in: 'body',
      description: 'Name of the playlist',
      required: true,
      type: 'integer',
      schema: { $name: 'Reggae' }
    }
    */

    if (!has(req.body, ['name']))
      throw new CodeError('The playlist name is missing', 400);
    const existing = await prisma.playlist.findFirst({
      where: { name: req.body.name },
    });
    if (existing === null) {
      const playlist = await prisma.playlist.create({
        data: {
          name: req.body.name,
        },
      });
      res.status(201).json({
        playlist,
      });
    } else {
      res.status(400).json({
        message: 'The playlist already exists',
        existing,
      });

      /*
      #swagger.responses[201] = {
        description: 'Playlist successfully created.',
        schema: {
          id: 1,
          name: 'Reggae',
          createdAt: '2023-03-25 13:20:24.579',
        }
      }
      #swagger.responses[400] = {
        description: 'Playlist already exists.',
        schema: {
          message: 'The playlist already exists',
          existing: {
            id: 1,
            name: 'Reggae',
            createdAt: '2023-03-25 13:20:24.579',
          }
        }
      }
      */
    }
  },
  async removePlaylist(req, res) {
    /*
    #swagger.tags = ['Playlist']
    #swagger.summary = 'Remove a playlist.'
    #swagger.parameters['id'] = {
      in: 'body',
      description: 'Id of a playlist',
      required: true,
      type: 'integer',
      schema: { $id: 4 }
    }
    */
    const playlist = await prisma.playlist.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      message: 'Playlist deleted',
      playlist,
    });
    /* #swagger.responses[200] = {
      description: 'Playlist successfully deleted.',
      schema: {
        message: 'Playlist deleted',
        playlist: {
          id: 1,
          name: 'Reggae',
          createdAt: '2023-03-25 13:20:24.579'
        }
      }
    } */
  },
  async editPlaylist(req, res) {
    /*
    #swagger.tags = ['Playlist']
    #swagger.summary = 'Edit a playlist's name.'
    #swagger.parameters['id'] = {
      in: 'body',
      description: 'Id of a playlist',
      required: true,
      type: 'integer',
      schema: { $id: 4 }
    }
    #swagger.parameters['name'] = {
      in: 'body',
      description: 'New name of the playlist',
      required: true,
      type: 'string',
      schema: { $name: 'Chill' }
     }
    */
    if (!has(req.body, ['name', 'id']))
      throw new CodeError('Playlist was left intact', 400);
    const playlist = await prisma.playlist.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
      },
    });
    res.status(200).json({
      message: 'Playlist updated',
      playlist,
    });
    /*
    #swagger.responses[200] = {
      description: 'Playlist successfully updated.',
      schema: {
        message: 'Playlist updated',
        playlist: {
          id: 1,
          name: 'Chill',
          createdAt: '2023-03-25 13:20:24.579'
        }
      }
    }
    */
  },
};
