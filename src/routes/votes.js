const express = require("express");
const router = express.Router();
const votes = require("../controllers/votes");

router.route("/votes").all().put(votes.addVote).delete(votes.removeVote).patch(votes.updateVotesNb);

module.exports = router;
