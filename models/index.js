'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config=require('../config/config.js')
const db = {};



console.log('DATABASE - ', config.database);
console.log('USERNAME - ', config.username);
console.log('PASSWORD - ',config.password );
console.log('HOST - ',config.host);

let sequelizeOptions = { ...config };
 
if (config.host !== 'localhost') {
    sequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false // This will allow connections to RDS without checking the certificate, but consider verifying the certificate in a production environment for added security.
        }
    };
}
 
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    sequelizeOptions

);

const Assignment = require('./assignment')(sequelize, Sequelize);
db[Assignment.name] = Assignment;

const Account = require('./account')(sequelize, Sequelize);
db[Account.name] = Account;

const Submission = require('./submission')(sequelize, Sequelize);
db[Submission.name] = Submission;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
console.log('In index.js -' ,sequelize)
module.exports=db