const express = require('express');
const spotifyApi = require('../controllers/spotify-api');
const router = express.Router();

router.post('/runSearch', spotifyApi.searchApi);

module.exports = router;
