const express= require('express');
var router = express.Router();
const logger=require('../logger/index.js')

router.get('/', (req, res) => {
    // Respond with content or perform actions
    logger.info('Web application is successfully running at port 3000!')
    res.send('Hello, this is a wep applicaion running at port 3000!');
  });
  
  module.exports = router;