/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('First test', () => {
  it('Should test to see if App is Up', () => {
    chai
      .request(app)
      .get('/')
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal(`Welcome to Author's Haven`);
      });
  });
});
