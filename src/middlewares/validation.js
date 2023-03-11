const has = require('has-keys');
const CodeError = require('../CodeError');
const isInt = function (id) {
  return !isNaN(id) && parseInt(Number(id)) == id && !isNaN(parseInt(id, 10));
};
const validateId = function (req, res, next) {
  if (!has(req.body, 'id')) throw new CodeError('Id is missing', 400);
  if (!isInt(req.body.id)) throw new CodeError('Id is not an int', 400);
  req.body.id = parseInt(req.body.id);
  next();
};

module.exports = { validateId };
