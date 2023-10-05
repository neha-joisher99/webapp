

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

// const PORT=3000
// app.listen(PORT,  ()=>{
//     console.log(`Server is running on port: http://localhost:${PORT }`)
//   })

db.sequelize.sync({alter:true}).then((reult)=>{
    console.log('Connected');
    loadUserDataFromCSV();
  }).catch((error)=>{
    console.log(error)
  })

  module.exports=app;