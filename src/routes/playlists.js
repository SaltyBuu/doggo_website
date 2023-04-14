const express = require('express');
const router = express.Router();
const playlist = require('../controllers/playlists');
const { validateId, checkRequest } = require('../middlewares/validation');
router
  .route('/playlists')
  .all(checkRequest)
  .put(playlist.addPlaylist)
  .delete(validateId, playlist.removePlaylist)
  .patch(validateId, playlist.updatePlaylist);

module.exports = router;
