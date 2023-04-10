const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const { validateId } = require('../middlewares/validation');

router
  .route('/users/:id')
  .get(users.getUser)
  .delete(validateId, users.removeUser);
router.route('/users').put(users.addUser).patch(validateId, users.updateUser);

module.exports = router;
