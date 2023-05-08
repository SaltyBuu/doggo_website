const express = require('express');
const router = express.Router();
const songs = require('../controllers/songs');
const {
  validateId,
  checkRequest,
  checkAdmin,
} = require('../middlewares/validation');

router
  .route('/songs')
  .post(checkRequest, songs.searchSong)
  .put(checkRequest, songs.addSong)
  .delete(checkAdmin, validateId, songs.removeSong)
  .patch(checkAdmin, validateId, songs.updateSong);

module.exports = router;
