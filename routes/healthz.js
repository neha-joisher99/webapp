const express = require('express');
const router = express.Router();
const { sequelize } = require('../models/index'); // Import the Sequelize instance
//const db = require('./models/index.js');


router.all('', async (req, res) => {
  try {
    // Check the database connectivity
    const isDatabaseConnected = await checkDatabaseConnectivity();

    const contentLength = req.get('Content-Length');
    if (req.method !== 'GET') {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(405).send();
      return;
    }
    if (Object.keys(req.query).length > 0) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(400).send();
      return;
    }
    if (contentLength > 0) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(400).send();
      return;
    }

    if (isDatabaseConnected) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(200).send();
    } else {
      // Database connection error, return a 503 status code
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(503).send();
    }
  } catch (error) {
    // Handle other errors as needed
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Length', '0');
    console.log(error);
    res.status(503).send();
  }
});

async function checkDatabaseConnectivity() {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = router;
