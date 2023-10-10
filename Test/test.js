
const request = require('supertest');
const app = require('../app.js');
const chai = require('chai');


// Use the 'expect' style assertion
const expect = chai.expect;

describe('/healthz endpoint', () => {
  it('should return a 200 status when the database is available', async () => {
    const response = await request(app).get('/healt');
    expect(response.status).to.equal(200); // Use 'to.equal' for Chai assertions
  });
});
