// const express = require('express');
// const dotenv = require('dotenv');
// const db = require('./models/index.js');
// const bodyParser = require('body-parser')
// const loadUserDataFromCSV = require('./csvprocessor.js')

//dotenv.config(); 

//const PORT=3000
// app.use(bodyParser.json()); // Parse JSON request bodies
// app.use(bodyParser.urlencoded({ extended: true }));
const app=require('./app')

// const router = require ('./routes/assignments.js')
// app.use('/assignments',router)

// const routerhealth = require('./routes/healthz.js');
// app.use('/healthz', routerhealth);

// app.listen(PORT,  ()=>{
//   console.log(`Server is running on port: http://localhost:${PORT }`)
// })

// async function main() {
//   try {
//         await db.sequelize.authenticate({ alter: true });
//         loadUserDataFromCSV();
//   }
//   catch(err){
//   console.log(err )
// }}

// main(); 

// db.sequelize.sync({alter:true}).then((reult)=>{
//   console.log('Connected');
//   loadUserDataFromCSV();
// }).catch((error)=>{
//   console.log(error)
// })








const loadUserDataFromCSV = require('./csvprocessor.js')



//import csv users



const PORT=3000
app.listen(PORT,  ()=>{
    console.log(`Server is running on port: http://localhost:${PORT }`)
})

