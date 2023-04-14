const express = require('express');
const router = express.Router();
const songs = require('../controllers/songs');
const { validateId, checkRequest } = require('../middlewares/validation');

router
  .route('/songs')
  .all(checkRequest)
  .post(songs.searchSong)
  .put(songs.addSong)
  .delete(validateId, songs.removeSong)
  .patch(validateId, songs.updateSong);

module.exports = router;
