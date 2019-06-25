/* eslint-env mocha */
const chai = require('chai');

const chaiHttp = require('chai-http');

const { app } = require('../index');

const { expect } = chai;

chai.use(chaiHttp);

describe('First test', () => {
  it('Should test to see if App is Up', () => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Welcome to Author's Haven");
      });
  });
});
