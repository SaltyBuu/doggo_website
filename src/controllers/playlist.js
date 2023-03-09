const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');

module.exports = {
  async searchSong(res, req) {},
  async addSong(res, req) {},
  async removeSong(res, req) {},
  async editSong(res, req) {},
};
