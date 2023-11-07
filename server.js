
const app=require('./app')

const db = require('./models/index.js');
const loadUserDataFromCSV = require('./csvprocessor.js');
const logger=require('./logger/index.js')

const PORT=3000
db.sequelize.sync({ alter: true })
  .then(() => {
    logger.info('Connected to the database')
    console.log('Connected to the database');
    loadUserDataFromCSV();
    app.listen(PORT, () => {
      logger.info(`Server is running on port: http://localhost:${PORT}`)
      console.log(`Server is running on port: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Database connection error: ${error} `)
    console.error('Database connection error:',error);
  });

  

  const gracefulShutdown = () => {
    logger.info('Shutting down gracefully.');
    console.log('Shutting down gracefully.');
  
    // Stop accepting new connections and close existing ones
    server.close(async () => {
      logger.info('Closed out remaining connections.');
      console.log('Closed out remaining connections.');
  
      // Close database connections
      try {
        await db.sequelize.close();
        logger.info('Database connection closed.');
        console.log('Database connection closed.');
      } catch (error) {
        logger.error('Error during database disconnection', error);
        console.error('Error during database disconnection', error);
      }
  
      // Exit the process
      process.exit(0);
    });
  };
  
  // Handle SIGTERM signal (e.g., when you use "kill" command)
  process.on('SIGTERM', gracefulShutdown);
  
  // Handle SIGINT signal (e.g., when you press Ctrl+C in the terminal)
  process.on('SIGINT', gracefulShutdown);
