const Sequelize = require('sequelize');
const db = require('database');
const users = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  login: {
    type: Sequelize.STRING(50),
    validate: {
      notNull: true,
      is: /^[a-zA-Z\-'\s]{1,30}$/i,
    },
  },
  password: {
    type: Sequelize.STRING(100),
    validate: {
      notNull: true,
      is: /^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{10,}$/i,
      //Minimum 10 characters, at least one uppercase letter, one lowercase letter and one number:
    },
  },
  mail: {
    type: Sequelize.STRING(30),
    validate: {
      notNull: true,
      isEmail: true,
    },
  },
});
module.exports = users;
