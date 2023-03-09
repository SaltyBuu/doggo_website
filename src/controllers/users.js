const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');

module.exports = {
  async getUser(res, req) {},
  async addUser(res, req) {},
  async removeUser(res, req) {},
  async editUser(res, req) {},
};
