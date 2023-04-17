const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const { validateId, checkRequest } = require('../middlewares/validation');

router
  .route('/users/:id')
  .all(checkRequest)
  .get(users.getUser)
  .delete(validateId, users.removeUser);
router
  .route('/users')
  .all()
  .put(users.addUser)
  .patch(checkRequest, validateId, users.updateUser);

module.exports = router;
