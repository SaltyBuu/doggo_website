const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const has = require('has-keys');
const CodeError = require('../CodeError');
const { isInt } = require('../middlewares/validation');
const { TOKENSECRET } = process.env;

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
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'User information.',
        required: true,
        schema: {
            login: 'Alfredus',
            password: 'oueoueoue67',
            mail: 'lafamille@letsgo.org',
        }
    }
    */
    //TODO Password validation
    if (!has(req.body, ['login', 'password', 'mail']))
      throw new CodeError('Missing parameters', 400);
    console.log('passed params validation');
    //TODO Email validation
    const user = await prisma.user.findFirst({
      where: {
        login: req.body.login,
      },
    });
    console.log('found user:', user);
    if (user == null) {
      const newUser = await prisma.user.create({
        data: {
          login: req.body.login,
          mail: req.body.mail,
          password: req.body.password,
        },
      });
      console.log('created user:', newUser);

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
        schema: { $id: 5 }

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
            user: { $ref: '#/definitions/user' }
        }
    }
    */
  },
  async updateUser(req, res) {
    /*
    #swagger.tags = ['User']
    #swagger.summary = 'Update a user.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Id of a user',
        required: true,
        schema: {
            id: 3,
            login: 'Alfredus',
            password: 'oueoueoue67',
            mail: 'lafamille@letsgo.org',
        }
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
            user: { $ref: '#/definitions/user' }
        }
    }
    */
  },
  async getToken(req, res) {
    /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Authenticate user.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Login and password hash of a user',
        required: true,
        schema: {
            login: 'Alfredus',
            password: 'o4e67bcda8e9',
        }
    }
    */
    console.log('Le voilà ton body !', req.body);
    if (!has(req.body, ['login', 'password'])) {
      throw new CodeError('Missing login or password', 400);
    }
    const user = await prisma.user.findFirst({
      where: {
        login: req.body.login,
        password: req.body.password,
      },
    });
    if (user) {
      console.log('USER:', user);
      //TODO handle admin verification
      const payload = {
        userId: user.id,
        login: user.login,
        isAdmin: user.isAdmin,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };
      console.log('TOKENSECRET', TOKENSECRET);
      console.log('expiration:', payload.exp);
      // Generate token
      const token = jwt.sign(payload, TOKENSECRET, { algorithm: 'HS256' });
      res.status(200).json({
        token,
        userid: user.id,
      });
    } else {
      res.status(403).json({ message: 'Unknown user.' });
    }
    /*
    #swagger.responses[200] = {
        description: 'Token generated.',
        schema: {
            token: 'Ddefzkjefbkzejf'
        }
    }
    #swagger.responses[403] = {
        description: 'Unknown user.',
        schema: {
            message: 'Unknown user.'
        }
    }
    */
  },
};
