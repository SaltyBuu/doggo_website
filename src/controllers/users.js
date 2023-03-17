const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");
const { isInt } = require("../middlewares/validation");

module.exports = {
  async getUser(req, res) {
    if (!has(req.params, "id")) throw new CodeError("Id is missing", 400);
    if (!isInt(req.params.id)) throw new CodeError("Id is not an int", 400);
    req.params.id = parseInt(req.params.id);
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
      },
    });
    if (user != null) {
      res.json({
        user,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  },
  async addUser(req, res) {
    //TODO Password validation
    if (!has(req.body, ["login", "password", "mail"]))
      throw new CodeError("Missing parameters", 400);
    //TODO Email validation
    const user = await prisma.user.findFirst({
      where: {
        login: req.body.login,
      },
    });
    if (user != null) {
      const newUser = await prisma.user.create({
        data: {
          login: req.body.login,
          mail: req.body.mail,
          password: req.body.password,
        },
      });
      res.status(201).json({
        newUser,
      });
    } else {
      res.status(400).json({
        message: "The user already exists",
      });
    }
  },
  async removeUser(req, res) {
    const user = await prisma.user.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      message: "User deleted",
      user,
    });
  },
  async editUser(req, res) {
    const user = await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        login: req.body.login || undefined,
        password: req.body.password || undefined,
        mail: req.body.mail || undefined,
      },
    });
    res.status(200).json({
      message: "Song updated",
      user,
    });
  },
};
