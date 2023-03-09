const { DataTypes } = require('sequelize');
const db = require('src/sequelize/database');

const songs = db.define('songs', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    validate: {
      notNull: true,
      is: /^[a-zA-Z\-'\s]{1,30}$/i,
    },
  },
  album: {
    type: DataTypes.STRING(30),
    validate: {
      notNull: true,
      is: /^[a-zA-Z\-'\s]{1,30}$/i,
    },
  },
  artist: {
    type: DataTypes.STRING(30),
    validate: {
      notNull: true,
      is: /^[a-zA-Z\-'\s]{1,30}$/i,
    },
  },
});
module.exports = songs;
