const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const has = require('has-keys');
const CodeError = require('../CodeError');
const { validateId } = require('../middlewares/validation');

router
  .route('/users')
  .get(validateId, users.getUser)
  .post(users.addUser)
  .delete(validateId, users.removeUser)
  .patch(validateId, users.editUser);

module.exports = router;
