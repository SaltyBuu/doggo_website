const express = require('express');
const router = express.Router();
const playlistSongs = require('../controllers/playlistSongs');

router
  .route('/:playlistId/songs')
  .put(playlistSongs.addSong)
  .get(playlistSongs.getSongs);

router
  .route('/:playlistId/:songId')
  .post(playlistSongs.searchSong)
  .delete(playlistSongs.removeSong)
  .patch(playlistSongs.editSong); //votesNb & submitter

module.exports = router;
