const express = require('express');
const router = express.Router();
const votes = require('../controllers/vote');

router.route('/vote')
    .all()
    .post(votes.addVote)
    .delete(votes.removeVote)

module.exports = router;
