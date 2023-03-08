const Sequelize = require('sequelize');
const db = require('database');
const songs = db.define('songs', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(50),
    validate: {
      notNull: true,
      is: /^[a-zA-Z\-'\s]{1,30}$/i,
    },
  },
  album: {
    type: Sequelize.STRING(30),
    validate: {
      notNull: true,
      is: /^[a-zA-Z\-'\s]{1,30}$/i,
    },
  },
  artist: {
    type: Sequelize.STRING(30),
    validate: {
      notNull: true,
      is: /^[a-zA-Z\-'\s]{1,30}$/i,
    },
  },
});
module.exports = songs;
