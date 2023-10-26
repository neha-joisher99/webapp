'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
//const config = require(__dirname + "/../config/config.js");
const config=require('../config/config.js')
const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

console.log('DATABASE - ', config.database);
console.log('USERNAME - ', config.username);
console.log('PASSWORD - ',config.password );
console.log('HOST - ',config.host);
let sequelize;
sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const Assignment = require('./assignment')(sequelize, Sequelize);
db[Assignment.name] = Assignment;

const Account = require('./account')(sequelize, Sequelize);
db[Account.name] = Account;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
console.log('In index.js -' ,sequelize)
module.exports=db
