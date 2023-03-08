const Sequelize = require('sequelize');
const db = require('database');
const playlists = db.define('playlists', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(100),
    validate: {
      isNull: false,
      is: /^[a-z\-'\s]{1,100}$/i,
    },
  },
});
module.exports = playlists;
