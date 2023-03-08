const Sequelize = require('sequelize');
const db = new Sequelize('database', 'admin', 'admin', {
  dialect: 'postgres',
  // logging: (...msg) => console.log(msg),
});
module.exports = db;
