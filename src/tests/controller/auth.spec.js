import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getUserData, Response, createUser, getUser } from '../utils/db.utils';
import authController from '../../controllers/auth.controllers';
import app from '../../index';
import models from '../../db/models';
import { getPasswordResetToken } from '../../helpers/jwt.helper';

const { User } = models;

chai.use(chaiHttp);
chai.use(sinonChai);

const { expect, request } = chai;

describe('Auth API endpoints', () => {
  describe('POST /users/signup', () => {
    before(async () => {
      await User.destroy({ where: {}, force: true });
    });

    it('Should successfully signup a user', done => {
      request(app)
        .post('/api/v1/users/signup')
        .send(getUserData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res).to.be.an('Object');
          expect(res.body).to.have.property('user');
          done();
        });
    });

    it('Should not allow null user input for sign up', done => {
      request(app)
        .post('/api/v1/users/signup')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          done();
        });
    });

    it('Should not allow invalid user input', done => {
      request(app)
        .post('/api/v1/users/signup')
        .send({ email: 'sandy', password: '' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          done();
        });
    });

    it('Should not allow duplicated user register', done => {
      request(app)
        .post('/api/v1/users/signup')
        .send(getUserData)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body).to.have.property('errors');
          done();
        });
    });

    it('Should return internal server error', async () => {
      const req = {
        body: {}
      };
      const res = new Response();
      sinon.stub(res, 'status').returnsThis();
      await authController.signUp(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });
  });

  describe('POST /users/login', () => {
    it('Should log user in successfully', async () => {
      const user = getUser();

      await createUser(user);

      const response = await request(app)
        .post('/api/v1/users/login')
        .send(user);
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
    });

    it('should return error for a wrong email', async () => {
      const user = getUser();

      await createUser(user);

      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'wrong@email.com',
          password: user.password
        });
      expect(response).to.have.status(400);
      expect(response).to.be.a('object');
      expect(response.body.message).to.equal('Invalid credentials');
    });

    it('should return error for a wrong password', async () => {
      const user = getUser();

      await createUser(user);
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: user.email,
          password: 'limah000'
        });
      expect(response).to.have.status(400);
      expect(response.body.message).to.equal('Invalid credentials');
    });
  });

  describe('POST /users/forgot_password', () => {
    const endpoint = '/api/v1/users/forgot_password';
    it('should send link for password reset', async () => {
      const user = getUser();
      const { email } = user;
      user.email = email.toLowerCase();

      await createUser(user);

      const response = await request(app)
        .post(endpoint)
        .send({ email: user.email });

      expect(response).to.have.status(201);
      expect(response.body.status).to.equal('success');
      expect(response.body.data.message).to.equal(
        'please check your mail for password reset instructions'
      );
    });

    it('should send link for password reset', async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ email: 'randomMal@doesnt.com' });

      expect(response).to.have.status(404);
      expect(response.body.status).to.equal('error');
      expect(response.body.error.message).to.equal('email does not exist');
    });

    it('should return error for wrong email format', async () => {
      const email = 'wrongmailformat';

      const response = await request(app)
        .post(endpoint)
        .send({ email });

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('error');
      expect(response.body).have.property('errors');
    });
  });

  describe('POST /users/password_reset', () => {
    const endpoint = '/api/v1/users/password_reset';
    it('should return an error message', async () => {
      const response = await request(app)
        .patch(endpoint)
        .send({ password: 'password' });

      expect(response).to.have.status(401);
      expect(response.body.status).to.equal('error');
      expect(response.body.error.message).to.equal('Authentication error');
    });
  });
});
