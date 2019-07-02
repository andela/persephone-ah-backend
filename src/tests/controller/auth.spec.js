import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { getUserData, Response, createUser, getUser } from '../utils/db.utils';
import authController from '../../controllers/auth.controller';
import AuthenticationMiddleWare from '../../middlewares/profileUpdateCheck.middleware';
import app from '../../index';
import models from '../../db/models';

const { User } = models;

const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);
let userToken;
let secondUserToken;
let deletedUserToken;
before(done => {
  chai
    .request(app)
    .post('/api/v1/users/signup')
    .send({
      firstName: 'tobe',
      lastName: 'deleted',
      email: 'deleted@user.com',
      password: 'NewUser20'
    })
    .end((err, res) => {
      const { token } = res.body.data;
      deletedUserToken = token;
      done(err);
    });
});

describe('Auth API endpoints', () => {
  describe('POST /users/signup', () => {
    before(async () => {
      await User.destroy({ where: {}, force: true });
    });
    before(done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          firstName: 'new',
          lastName: 'user',
          email: 'new@user.com',
          password: 'NewUser20'
        })
        .end((err, res) => {
          const { token } = res.body.data;
          userToken = token;
          done(err);
        });
    });

    before(done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          firstName: 'second',
          lastName: 'user',
          email: 'second@user.com',
          password: 'NewUser20'
        })
        .end((err, res) => {
          const { token } = res.body.data;
          secondUserToken = token;
          done(err);
        });
    });

    it('Should successfully signup a user', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(getUserData)
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.firstName).to.equal('james');
          expect(response.body.data.lastName).to.equal('Monday');
          expect(response.body.data.email).to.equal('author@email.com');
          done();
        });
    });

    it('Should not allow null user input for sign up', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({})
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data[0].msg).to.equal(
            'First name must be only alphabetical chars'
          );
          done();
        });
    });

    it('Should not allow invalid user input', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'sandy',
          password: 'samsss',
          firstName: 'tytyt',
          lastName: 'ghghghg'
        })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data[0].msg).to.equal(
            'Please enter a valid email'
          );
          done();
        });
    });

    it('Should not allow duplicated user register', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(getUserData)
        .end((error, response) => {
          expect(response.status).to.equal(409);
          expect(response.body.data.message).to.equal('user already exists');
          done();
        });
    });

    it('Should return internal server error', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await authController.signUp(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('POST /users/login', () => {
    it('Should log user in successfully', async () => {
      const user = getUser();

      await createUser(user);

      const response = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send(user);
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data.email).to.equal(user.email);
    });

    it('should return error for a wrong email', async () => {
      const user = getUser();

      await createUser(user);

      const response = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'wrong@email.com',
          password: user.password
        });
      expect(response).to.have.status(400);
      expect(response).to.be.a('object');
      expect(response.body.data.message).to.equal('Invalid email/password');
    });

    it('should return error for a wrong password', async () => {
      const user = getUser();
      await createUser(user);
      const response = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send({
          email: user.email,
          password: 'limah000'
        });
      expect(response).to.have.status(400);
      expect(response.body.data.message).to.equal('Invalid email/password');
    });
  });

  describe('PUT users/profileupdate', () => {
    it('Should update the provided user profile details', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/profileupdate')
        .set('Authorization', `Bearer ${userToken}`)
        .field('bio', 'My name is my name')
        .field('userName', 'aboyhasnoname')
        .field('firstName', 'newname')
        .attach(
          'image',
          './src/tests/testFiles/default_avatar.png',
          'image.jpeg'
        );

      expect(response).to.have.status(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data.bio).to.be.equal('My name is my name');
      expect(response.body.data.userName).to.be.equal('aboyhasnoname');
      expect(response.body.data).to.have.keys(
        'bio',
        'userName',
        'firstName',
        'lastName',
        'twitterHandle',
        'facebookHandle',
        'image'
      );
    });

    it('Should return an error if an update is about to happen on a non-existent account', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/profileupdate')
        .set('Authorization', `Bearer ${deletedUserToken}`)
        .send({
          bio: 'My name is my name',
          userName: 'aboyhasnoname',
          firstName: 'newname'
        });

      expect(response).to.have.status(404);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data.message).to.be.equal(
        'User account does not exist'
      );
    });

    it('Should return an error if a new user tries to take an existing username', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/profileupdate')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({
          userName: 'aboyhasnoname'
        });

      expect(response).to.have.status(409);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data.message).to.be.equal(
        'Username has already been taken'
      );
    });

    it('Should return internal server error while updating a profile', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await AuthenticationMiddleWare.profileChecks(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });
});
