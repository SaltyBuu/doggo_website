const { DataTypes } = require('sequelize');
const db = require('src/sequelize/database');

const users = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  login: {
    type: DataTypes.STRING(50),
    validate: {
      notNull: true,
      is: /^[a-zA-Z\-'\s]{1,30}$/i,
    },
  },
  password: {
    type: DataTypes.STRING(100),
    validate: {
      notNull: true,
      is: /^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{10,}$/i,
      //Minimum 10 characters, at least one uppercase letter, one lowercase letter and one number:
    },
  },
  mail: {
    type: DataTypes.STRING(30),
    validate: {
      notNull: true,
      isEmail: true,
    },
  },
});
module.exports = users;
