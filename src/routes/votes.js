const express = require('express');
const router = express.Router();
const votes = require('../controllers/votes');
const { checkRequest } = require('../middlewares/validation');

router
  .route('/votes')
  .all(checkRequest)
  .put(votes.addVote)
  .delete(votes.removeVote)
  .patch(votes.updateVotesNb);

module.exports = router;
