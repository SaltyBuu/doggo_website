const Sequelize = require('sequelize');
const db = require('database');
const songs = require('songs');
const users = require('users');
const playlists = require('playlists');
const playlist_songs = db.define('playlist_id', {
  playlist_id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    references: {
      model: playlists,
      key: 'id',
    },
  },
  song_id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    references: {
      model: songs,
      key: 'sid',
    },
  },
  rank: {
    type: Sequelize.INTEGER,
    validate: {
      not: 0,
    },
  },
  submitter_id: {
    type: Sequelize.INTEGER,
    references: {
      model: users,
      key: 'id',
    },
    allowNull: false,
  },
});
module.exports = playlist_songs;
