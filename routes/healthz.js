const express = require('express');
var router = express.Router();


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
    } 
    catch (error) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(503).send();
    }
  });



  module.exports = router;