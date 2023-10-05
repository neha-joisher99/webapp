const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server.js');

chai.use(chaiHttp);
const expect = chai.expect;

describe("Healthz endpoint ", ()=>{
    it('should return a 200 status', async ()=>{
        const response = await chai.request(app).get('/healthz');
        expect(response.status).to.equal(200);
    });
})