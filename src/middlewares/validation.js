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
      console.log('Token reçu:', token);
      jwt.verify(
        token,
        TOKENSECRET,
        { algorithm: 'HS256' },
        function (err, decoded) {
          if (err) {
            console.log('JsonWebToken error:', err);
            throw new CodeError('Forbidden', 403);
          } else {
            console.log('exp:', decoded.exp);
            console.log('exp*1000:', decoded.exp);
            if (Date.now() >= decoded.exp) next();
            else throw new CodeError('Expired token', 403);
          }
        }
      );
    } else {
      throw new CodeError('Forbidden', 403);
    }
    next();
  },
};
