const fs = require('fs');
const {parse} = require('csv-parse');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./models');
const path=require('path');
const account = require('./models/account');

const loadUserDataFromCSV = async () => {
  try {
     const csvData = fs.readFileSync('/opt/users.csv', 'utf-8');
      const rows = csvData.split('\n').map((row) => row.split(','));
      
      const processedEmails = new Set();

      for (let i = 1; i < rows.length; i++) {
        const [firstname, lastname, email, password] = rows[i].map((col) => col.trim());
  
        if (!firstname || !lastname || !email || !password) {
          console.log(`Skipping row ${i + 1} due to missing values.`);
          continue;
        }
  
        if (processedEmails.has(email)) {
          console.log(`Skipping row ${i + 1} as an account with email ${email} already exists.`);
          continue;
        }
  
        const existingAccount = await db.account.findOne({
          where: {
            email: email,
          },
        });
  
        if (existingAccount) {
          console.log(`Skipping row ${i + 1} as an account with email ${email} already exists.`);
          continue;
        }
  
        await db.account.create({ firstname, lastname, email, password });
        processedEmails.add(email); // Add the email to the set to avoid duplicates
      }

       console.log('CSV data loaded and inserted successfully.');
      }catch(error){
        console.log('error in loading', error)
      }
    }


module.exports = loadUserDataFromCSV;
 