
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const router = require('./routes/assignments.js');
const routerHealth = require('./routes/healthz.js');

dotenv.config();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/assignments', router);
app.use('/healthz', routerHealth);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;

const loadUserDataFromCSV = require('./csvprocessor.js')
const express = require('express');
const dotenv = require('dotenv');
const db = require('./models/index.js');
const bodyParser = require('body-parser')
const app=express();
dotenv.config(); 
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

const router = require ('./routes/assignments.js')
app.use('/assignments',router)

const routerhealth = require('./routes/healthz.js');
app.use('/healthz', routerhealth);


db.sequelize.sync({alter:true}).then((reult)=>{
    console.log('Connected');
    loadUserDataFromCSV();
  }).catch((error)=>{
    console.log(error)
  })

  module.exports=app;

