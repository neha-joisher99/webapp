
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

