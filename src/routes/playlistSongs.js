const express = require('express');
const router = express.Router();
const playlistSongs = require('../controllers/playlistSongs');
const { checkRequest } = require('../middlewares/validation');

router
  .route('/:playlistId/songs')
  .put(checkRequest, playlistSongs.addSong)
  .get(playlistSongs.getSongs);

router
  .route('/:playlistId/:songId')
  .all(checkRequest)
  .post(playlistSongs.searchSong)
  .delete(playlistSongs.removeSong)
  .patch(playlistSongs.editSong); //votesNb & submitter

module.exports = router;
