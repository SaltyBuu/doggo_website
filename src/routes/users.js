const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.route('/users')
    .all()
    .get(users.getUser)
    .post(users.addUser)
    .delete(users.removeUser)
    .patch(users.editUser)

module.exports = router;
