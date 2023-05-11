const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.post('/auth', users.getToken);
router.post('/adminAuth', users.getAdminToken);
module.exports = router;
