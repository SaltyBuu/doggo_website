const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const has = require("has-keys");
const CodeError = require("../CodeError");
const { validateId } = require("../middlewares/validation");

router.get("/users/:id", users.getUser);
router
  .route("/users")
  .post(users.addUser)
  .delete(validateId, users.removeUser)
  .patch(validateId, users.editUser);

module.exports = router;
