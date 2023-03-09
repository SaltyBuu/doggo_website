const { DataTypes } = require('sequelize');
const users = require('./users');
const songs = require('./songs');
const db = require('src/sequelize/database');

const votes = db.define('votes', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: users,
      key: 'id',
    },
  },
  song_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: songs,
      key: 'id',
    },
  },
  voteDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});
module.exports = votes;
