const Sequelize = require('sequelize');
const users = require('users');
const songs = require('songs');
const db = require('database');
const votes = db.define('votes', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: users,
      key: 'id',
    },
  },
  song_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: songs,
      key: 'id',
    },
  },
});
module.exports = votes;
