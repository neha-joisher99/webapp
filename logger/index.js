var appRoot = require("app-root-path");
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, colorize, printf } = format;

const myFormat = printf(({ level, message,  timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

var options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    format:  combine(
      colorize(),
      timestamp(),
      myFormat,
    ),
  },
};


const logger = createLogger({ 
  transports: [
  new transports.File({ filename: `${appRoot}/logs/error.log`, level: 'error', handleExceptions: true ,format: combine(
    timestamp(),
    prettyPrint()
  ),}),
  new transports.File({ filename: `/var/log/combined.log`, level: 'info',handleExceptions: true,   format: combine(
    timestamp(),
    prettyPrint()
  ), }),
  new transports.Console(options.console)
],
  exitOnError: false, 
})


logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

module.exports=logger;