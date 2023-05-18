const express = require('express');
const router = express.Router();
const playlistSongs = require('../controllers/playlistSongs');
const { checkRequest, checkAdmin } = require('../middlewares/validation');
const spotifyApi = require('../controllers/spotify-api');

router
  .route('/:playlistId/songs')
  .put(checkRequest, playlistSongs.addSong)
  .get(playlistSongs.getSongs);

router.get('/:playlistid/export/:playlisturi', checkRequest, spotifyApi.exportPlaylist);

router
  .route('/:playlistId/:songId')
  .post(checkRequest, playlistSongs.searchSong)
  .delete(checkAdmin, playlistSongs.removeSong)
  .patch(checkAdmin, playlistSongs.editSong); //votesNb & submitter

module.exports = router;
