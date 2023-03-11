const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const status = require('http-status');

module.exports = {
  async searchSong(req, res) {},
  async addSong(req, res) {},
  async removeSong(req, res) {},
  async editSong(req, res) {},
};
