const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router
  .route('/users')
  .get(users.getUser)
  .post(users.addUser)
  .delete(users.removeUser)
  .patch(users.editUser);

module.exports = router;
