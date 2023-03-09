const { DataTypes } = require('sequelize');
const db = require('src/sequelize/database');
const songs = require('./songs');
const users = require('./users');
const playlists = require('./playlists');

const playlist_songs = db.define('playlist_id', {
  playlist_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    references: {
      model: playlists,
      key: 'id',
    },
  },
  song_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    references: {
      model: songs,
      key: 'sid',
    },
  },
  rank: {
    type: DataTypes.INTEGER,
    validate: {
      not: 0,
    },
  },
  submitter_id: {
    type: DataTypes.INTEGER,
    references: {
      model: users,
      key: 'id',
    },
    allowNull: false,
  },
});
module.exports = playlist_songs;
