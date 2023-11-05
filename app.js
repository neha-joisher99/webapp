
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const router = require('./routes/assignments.js');
const routerHealth = require('./routes/healthz.js');
const routerApp=require('./routes/app.js')
const logger=require('./logger/index.js')

dotenv.config();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/assignments', router);
app.use('/healthz', routerHealth);
app.use('/', routerApp);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

  module.exports=app;


  

  