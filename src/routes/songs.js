const express = require('express');
const router = express.Router();
const songs = require('../controllers/songs');
const { validateId } = require('../middlewares/validation');

router
  .route('/songs')
  .all()
  .post(songs.searchSong)
  .put(songs.addSong)
  .delete(validateId, songs.removeSong)
  .patch(validateId, songs.updateSong);

module.exports = router;
