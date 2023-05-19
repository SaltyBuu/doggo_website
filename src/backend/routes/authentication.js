const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const spotifyapi = require('../controllers/spotify-api');

router.post('/auth', users.getAppToken);
router.post('/adminAuth', users.getAdminToken);
router.get('/spotifyLogin', spotifyapi.spotifyLogin);
router.get('/callback', spotifyapi.getUserToken);
module.exports = router;
