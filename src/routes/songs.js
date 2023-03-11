const express = require('express');
const router = express.Router();
const songs = require('../controllers/songs');
const { validateId } = require('../middlewares/validation');

router
  .route('/songs')
  .all()
  .get(validateId, songs.searchSong)
  .post(songs.addSong)
  .delete(validateId, songs.removeSong)
  .patch(validateId, songs.editSong);

module.exports = router;
