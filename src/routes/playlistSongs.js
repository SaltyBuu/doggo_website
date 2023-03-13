const express = require("express");
const router = express.Router();
const playlist = require("../controllers/playlistSongs");

router
  .route("/playlist")
  .all()
  .put(playlist.addSong)
  .delete(playlist.removeSong)
  .patch(playlist.editSong); //rank & submitter

router.get("/:playlist_id/:song_id", playlist.searchSong);

module.exports = router;
