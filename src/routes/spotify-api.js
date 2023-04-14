const express = require('express');
const spotifyApi = require('../controllers/spotify-api');
const router = express.Router();
const { checkRequest } = require('../middlewares/validation');

router.post('/runSearch', checkRequest, spotifyApi.searchApi);

module.exports = router;
