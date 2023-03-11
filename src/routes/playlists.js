const express = require('express');
const router = express.Router();
const playlist = require('../controllers/playlists');
const { validateId } = require('../middlewares/validation');
router
  .route('/playlists')
  .all()
  .get(playlist.addPlaylist)
  .delete(validateId, playlist.removePlaylist)
  .patch(validateId, playlist.editPlaylist);

module.exports = router;
