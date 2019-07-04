import chai from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import { getUser } from '../utils/db.utils';
import app from '../../index';

const { expect, request } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);
let userToken;
describe('User API endpoints', () => {
  let responseHook;
  before('sign up a random user', async () => {
    const randomUser = getUser();
    responseHook = await request(app)
      .post('/api/v1/users/signup')
      .send(randomUser);
  });
  describe('GET /users', async () => {
    it('should get all users', done => {
      userToken = responseHook.body.data.token;
      request(app)
        .get('/api/v1/users')
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.be.equal(200);
          expect(response.body.data).to.be.an('array');
          expect(response.body.data[0]).to.have.property('id');
          expect(response.body.data[0]).to.have.property('firstName');
          done();
        });
    });
    it('should not get all users if token is invalid', done => {
      request(app)
        .get('/api/v1/users')
        .end((error, response) => {
          expect(response.status).to.be.equal(400);
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.eq(
            'No token provided, you do not have access to this page'
          );
          done();
        });
    });
  });
});
