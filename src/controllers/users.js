const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const status = require("http-status");
const has = require("has-keys");
const CodeError = require("../CodeError");

module.exports = {
  async getUser(req, res) {
    const user = await prisma.user.findFirst({
      where: {
        id: req.body.id,
      },
    });
    res.json({
      status: true,
      user,
    });
  },
  async addUser(req, res) {
    //TODO Password validation
    if (!has(req.body, ["login", "password", "mail"]))
      throw new CodeError("User was not created", 400);
    //TODO Email validation
    const user = await prisma.user.upsert({
      where: {
        login: req.body.login,
      },
      update: {},
      create: {
        login: req.body.login,
        mail: req.body.mail,
        password: req.body.password,
      },
    });
    // const message = user === null ? 'User created' + user.login : '';
    res.json({
      status: true,
      message: "User created: " + user.login,
    });
  },
  async removeUser(req, res) {
    const user = await prisma.user.delete({
      where: {
        id: req.body.id,
      },
    });
    res.json({
      status: true,
      message: "User deleted: " + user.id,
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
    res.json({
      status: true,
      user,
    });
  },
};
