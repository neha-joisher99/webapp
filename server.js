
const app=require('./app')

const db = require('./models/index.js');
const loadUserDataFromCSV = require('./csvprocessor.js');

const PORT=3000
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Connected to the database');
    loadUserDataFromCSV();
    app.listen(PORT, () => {
      console.log(`Server is running on port: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:',error);
  });

  


