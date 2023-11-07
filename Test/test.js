const request = require('supertest');
const app = require('../app.js');
const chai = require('chai');
const expect = chai.expect;
const db = require('../models/index.js'); // Import your Sequelize instance
const log = require('why-is-node-running'); 

describe('/healthz endpoint', () => {
  // Using async function here
  it('should return a 200 status when the database is available', async () => {
    const response = await request(app).get('/healthz');
    expect(response.status).to.equal(200);
  });
  
  // Use an asynchronous function for after hook
  after((done) => {
    // Close Sequelize connections
    db.sequelize.close()
      .then(() => console.log('Database connections closed'))
      .catch((err) => console.error('Failed to close database connections', err))
      .finally(() => {
        // Set a delay before checking for open handles
        const timer = setTimeout(() => {
          log(); // Call why-is-node-running here
          clearTimeout(timer); // Clear the timeout to clean up
          done(); // Complete the after hook
        }, 500); // Adjust the timeout as needed to allow for cleanup
    });
  });
});
