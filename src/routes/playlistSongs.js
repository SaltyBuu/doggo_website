const express = require("express");
const router = express.Router();
const playlistSongs = require("../controllers/playlistSongs");

router.put("/:playlistId/songs", playlistSongs.addSong);

router
    .route("/:playlistId/:songId")
    .get(playlistSongs.searchSong)
    .delete(playlistSongs.removeSong)
    .patch(playlistSongs.editSong); //rank & submitter

module.exports = router;
