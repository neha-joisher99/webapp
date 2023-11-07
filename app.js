const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const router = require('./routes/assignments.js');
const routerHealth = require('./routes/healthz.js');
const routerApp = require('./routes/app.js');
const logger = require('./logger/index.js'); // Ensure this is set up correctly
const StatsD = require('node-statsd');

dotenv.config();

// StatsD client with error handler
const client = new StatsD({
  errorHandler: function (error) {
    logger.error("StatsD error: ", error); // Using logger instead of console.error
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info('Incrementing in statsd counter'); // Using logger instead of console.log
  client.increment('api_call', 1, [`method:${req.method}`, `path:${req.path}`]);
  next();
  res.on('finish', () => {
    logger.info('All middleware completed their execution for', req.path);
  });

});

client.socket.on('error', function(error) {
  logger.error("Error in socket: ", error); // Using logger instead of console.error
});

// Routes
app.use('/assignments', router);
app.use('/healthz', routerHealth);
app.use('/', routerApp);

// Error Handling Middleware should be last
app.use((err, req, res, next) => {
  logger.error(err.stack); // Using logger instead of console.error
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
