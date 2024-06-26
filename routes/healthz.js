const express = require('express');
const router = express.Router();
const { sequelize } = require('../models'); // Import the Sequelize instance
const logger=require('../logger/index.js')
const StatsD = require('node-statsd');

const client = new StatsD({
  errorHandler: function (error) {
    logger.error("StatsD error: ", error); // Using logger instead of console.error
  }
});
client.socket.on('error', function(error) {
    logger.error("Error in socket: ", error); // Using logger instead of console.error
  });

console.log('INNNN ')
router.all('', async (req, res) => {
console.log('router.all ')
client.increment('healthz')
  try {
    console.log('try')
    const isDatabaseConnected = await checkDatabaseConnectivity();
    const contentLength = req.get('Content-Length');
    if (req.method !== 'GET') {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      logger.error(`API healthz - ${req.method} Method not allowed!`)
      res.status(405).send();
      return;
    }
    if (Object.keys(req.query).length > 0) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      logger.error(`API healthz - Bad request = key - ${Object.keys(req.query)}`)
      res.status(400).send();
      return;
    }
    if (contentLength > 0) {
      const requestBody = JSON.stringify(req.body);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      logger.error(`API healthz - Bad request - Content length > 0 -  ${requestBody}`)
      res.status(400).send();
      return;
    }

    if (isDatabaseConnected) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      logger.info('API healthz - Database connected successfully! ')
      res.status(200).send();
      console.log('200')
    } else {
      // Database connection error, return a 503 status code
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      logger.error('In healthz - Database API unavailable!')
      res.status(503).send();
    }
  } catch (error) {
    // Handle other errors as needed
    console.log(error)
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Length', '0');
    logger.error('API healthz - Database API unavailable!')
    res.status(503).send();
  }
});

async function checkDatabaseConnectivity() {
  try {
    await sequelize.authenticate();
    console.log('In true');
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

module.exports = router;
