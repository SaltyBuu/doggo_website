const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');
const has = require('has-keys');

module.exports = {
  async getUser(req, res) {},
  async addUser(req, res) {
    res.send('heyy');
  },
  async removeUser(req, res) {},
  async editUser(req, res) {},
};
