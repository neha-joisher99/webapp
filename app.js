const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const router = require('./routes/assignments.js');
const routerHealth = require('./routes/healthz.js');
const routerApp = require('./routes/app.js');
const logger = require('./logger/index.js'); 
const StatsD = require('node-statsd');

dotenv.config();

// StatsD client with error handler
const client = new StatsD({
  errorHandler: function (error) {
    logger.error("StatsD error: ", error); 
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/v3/assignments', router);
app.use('/healthz', routerHealth);
app.use('/', routerApp);

// Error Handling Middleware should be last
app.use((err, req, res, next) => {
  logger.error(err.stack); 
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
