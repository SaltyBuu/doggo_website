const express = require("express");
const router = express.Router();
const playlist = require("../controllers/playlists");
const { validateId } = require("../middlewares/validation");
router
  .route("/playlists")
  .all()
  .post(playlist.addPlaylist)
  .delete(validateId, playlist.removePlaylist)
  .patch(validateId, playlist.editPlaylist);

module.exports = router;
