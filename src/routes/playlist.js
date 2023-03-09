const express = require('express');
const router = express.Router();
const playlist = require('../controllers/playlist');

router
  .route('/playlist')
  .all()
  .get(playlist.searchSong)
  .post(playlist.addSong)
  .delete(playlist.removeSong)
  .patch(playlist.editSong); //rank & submitter

module.exports = router;
