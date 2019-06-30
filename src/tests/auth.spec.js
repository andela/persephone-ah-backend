import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Auth API endpoints', () => {
  describe('POST /users/signin', () => {
    it('should return error for a wrong email', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'halimah@hali.com',
          password: 'halimah000'
        });
      expect(response).to.have.status(400);
      expect(response).to.be.a('object');
      expect(response.body.Error).to.equal('Invalid credentials');
    });

    it('should return error for a wrong password', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'halimah@ali.com',
          password: 'limah000'
        });
      expect(response).to.have.status(400);
      expect(response.body.Error).to.equal('Invalid credentials');
    });
  });
});
