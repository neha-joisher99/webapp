
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const router = require('./routes/assignments.js');
const routerHealth = require('./routes/healthz.js');
const routerApp=require('./routes/app.js')
const logger=require('./logger/index.js')
const StatsD = require('node-statsd');

dotenv.config();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/assignments', router);
app.use('/healthz', routerHealth);
app.use('/', routerApp);
// const statsd = require('node-statsd')
// const client = new statsd({ host : 'localhost', port : 8125})

const client = new StatsD({
  errorHandler: function (error) {
    console.error("StatsD error: ", error);
  }
});

app.use((req, res, next) => {
  console.log('Before incrementing in statsd counter');

  // Increment the counter in StatsD for tracking purposes.
  client.increment('api_call', 1, [`method:${req.method}`, `path:${req.path}`]);

  console.log('Incremented statsd counter successfully');

  // Set up the listener for the 'finish' event before calling next()
  res.on('finish', () => {
    console.log('All middleware completed their execution for', req.path);
  });

  // Continue to the next middleware
  next();
});


// Routes


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log('IN error stack')
  res.status(500).json({ error: 'Internal Server Error' });
});

  module.exports=app;


  

  