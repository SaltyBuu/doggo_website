const express = require('express');
const router = express.Router();
const songs = require('../controllers/songs');

router.route('/songs')
    .all()
    .get(songs.searchSong)
    .post(songs.addSong)
    .delete(songs.removeSong)
    .patch(songs.editSong)

module.exports = router;
