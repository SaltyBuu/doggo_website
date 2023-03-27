const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../CodeError');
const { isInt } = require('../middlewares/validation');

module.exports = {
  async getUser(req, res) {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'Get information of a user.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Id of a user',
      required: true,
      type: 'integer',
    }
    */
    if (!has(req.params, 'id')) throw new CodeError('Id is missing', 400);
    if (!isInt(req.params.id)) throw new CodeError('Id is not an int', 400);
    req.params.id = parseInt(req.params.id);
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
      },
    });
    if (user != null) {
      res.json({
        user,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
    /*
    #swagger.responses[404] = {
      description: 'User not found.',
      schema: {
        message: 'User not found'
      }
    }
    */
  },
  async addUser(req, res) {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'Add a user.'
    #swagger.parameters['login'] = {
      in: 'body',
      description: 'Username of a user',
      required: true,
      type: 'string',
    }
    #swagger.parameters['password'] = {
      in: 'body',
      description: 'Password of a user',
      required: true,
      type: 'string',
    }
    #swagger.parameters['mail'] = {
      in: 'body',
      description: 'Username of a user',
      required: true,
      type: 'string',
    }
    */
    //TODO Password validation
    if (!has(req.body, ['login', 'password', 'mail']))
      throw new CodeError('Missing parameters', 400);
    //TODO Email validation
    const user = await prisma.user.findFirst({
      where: {
        login: req.body.login,
      },
    });
    if (user != null) {
      const newUser = await prisma.user.create({
        data: {
          login: req.body.login,
          mail: req.body.mail,
          password: req.body.password,
        },
      });
      res.status(201).json({
        newUser,
      });
    } else {
      res.status(400).json({
        message: 'The user already exists',
      });
    }
    /*
    #swagger.responses[201] = {
      description: 'User created.',
      schema: {
        $ref: '#/definitions/user'
      }
    }
    #swagger.responses[400] = {
      description: 'User could not be created.',
      schema: {
        message: 'The user already exists'
      }
    }
    */
  },
  async removeUser(req, res) {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'Remove a user.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Id of a user',
        required: true,
        type: 'integer',
      }
    */
    const user = await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'User deleted',
      user,
    });
    /*
    #swagger.responses[200] = {
      description: 'User deleted.',
      schema: {
        message: 'User deleted',
        $ref: '#/definitions/user'
      }
    }
    */
  },
  async updateUser(req, res) {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'Update a user.'
    #swagger.parameters['id'] = {
      in: 'body',
      description: 'Id of a user',
      required: true,
      type: 'integer',
    }
    #swagger.parameters['login'] = {
      in: 'body',
      description: 'Username of a user',
      required: false,
      type: 'string',
    }
    #swagger.parameters['password'] = {
      in: 'body',
      description: 'Password of a user',
      required: false,
      type: 'string',
    }
    #swagger.parameters['mail'] = {
      in: 'body',
      description: 'Username of a user',
      required: false,
      type: 'string',
    }
    */
    const user = await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        login: req.body.login || undefined,
        password: req.body.password || undefined,
        mail: req.body.mail || undefined,
      },
    });
    res.status(200).json({
      message: 'User updated',
      user,
    });
    /*
    #swagger.responses[200] = {
      description: 'User updated.',
      schema: {
        message: 'User updated',
        $ref: '#/definitions/user'
      }
    }
    */
  },
};
