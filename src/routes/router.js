const router = require('express').Router();
router.use(require('./songs'));
router.use(require('./users'));
router.use(require('./votes'));
router.use(require('./playlist'));
module.exports = router;
