import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('GET /', () => {
  it('Should return `Welcome to Authors Haven`', done => {
    chai
      .request(app)
      .get('/')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response).to.be.an('Object');
        expect(response.body).to.have.property('status');
        expect(response.body.message).to.equal(`Welcome to Author's Haven`);
        done();
      });
  });

  it('Should return an error when there is an uncaught error on the app', done => {
    chai
      .request(app)
      .put('/api/v1/users/lo')
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.be.equal(
          'You are trying to access a wrong Route'
        );
        done();
      });
  });
});
