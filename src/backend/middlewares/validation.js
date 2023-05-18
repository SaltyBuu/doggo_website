const has = require('has-keys');
const { TOKENSECRET } = process.env;
const jwt = require('jsonwebtoken');
const CodeError = require('../CodeError');
module.exports = {
  isInt(id) {
    return !isNaN(id) && parseInt(Number(id)) == id && !isNaN(parseInt(id, 10));
  },
  validateId(req, res, next) {
    if (!has(req.body, 'id')) throw new CodeError('Id is missing', 400);
    if (!isInt(req.body.id)) throw new CodeError('Id is not an int', 400);
    req.body.id = parseInt(req.body.id);
    next();
  },
  checkRequest(req, res, next) {
    if (has(req.headers, ['x-access-token'])) {
      const token = req.headers['x-access-token'];
      jwt.verify(token, TOKENSECRET, { algorithm: 'HS256' }, function (err, decoded) {
        if (err) {
          res.status(403).json({ message: 'Expired token.' });
        } else {
          if (Date.now() >= decoded.exp) {
            console.log('valid token', decoded.login, decoded.userId);
            next();
          } else {
            console.log('expired token !!');
            next(new CodeError('Expired token', 403));
          }
        }
      });
    } else {
      next(new CodeError('Forbidden', 403));
    }
  },
  checkAdmin(req, res, next) {
    if (has(req.headers, ['x-access-token'])) {
      const token = req.headers['x-access-token'];
      jwt.verify(token, TOKENSECRET, { algorithm: 'HS256' }, function (err, decoded) {
        if (err) {
          res.status(403).json({ message: 'Expired token.' });
        } else {
          if (decoded.isAdmin) {
            console.log('Admin user', decoded.login);
            next();
          } else {
            res.status(403).json({ message: 'Unauthorized user.' });
            next(new Error('Unauthorized user : ' + decoded.login));
          }
        }
      });
    } else {
      next(new CodeError('Forbidden', 403));
    }
  },
};
