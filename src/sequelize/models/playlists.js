const { DataTypes } = require('sequelize');
const db = require('src/sequelize/database');

const playlists = db.define('playlists', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    validate: {
      isNull: false,
      is: /^[a-z\-'\s]{1,100}$/i,
    },
  },
});
module.exports = playlists;
