const router = require('express').Router();
router.use(require('./songs'));
router.use(require('./users'));
router.use(require('./votes'));
router.use(require('./playlists'));
router.use(require('./playlistSongs'));
router.use(require('./spotify-api'));
module.exports = router;
