// {
//   "development": {
//     "username": "nehajoisher",
//     "password": "neha",
//     "database": "dev_db",
//     "host": "localhost",
//     "dialect": "postgres"
//   }
// 

// require("dotenv").config({ path: '/etc/environment' });
require("dotenv").config();

const config = {
  host: process.env.HOST,
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  dialect: "postgres",
};

module.exports = config;