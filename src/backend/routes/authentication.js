const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const { checkAdmin } = require('../middlewares/validation');

router.post('/auth', users.getToken);
router.post('/adminAuth', users.getAdminToken);
module.exports = router;
