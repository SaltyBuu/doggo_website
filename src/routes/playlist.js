const express = require('express');
const router = express.Router();
const playlist_songs = require('../controllers/playlist');

router.route('/playlist')
    .all()
    .get(playlist_songs.searchElement)
    .post(playlist_songs.addElement)
    .delete(playlist_songs.removeElement)
    .patch(playlist_songs.editElement) //rank & submitter

module.exports = router;
