const {Sequelize} = require('sequelize');
const {setup} = require('setup')

const db = new Sequelize('database', 'admin', 'admin', {
  dialect: 'postgres',
  // logging: (...msg) => console.log(msg),
});
setup(db)
module.exports = db;
