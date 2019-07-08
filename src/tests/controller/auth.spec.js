import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';
import { getUserData, Response, createUser, getUser } from '../utils/db.utils';
import authenticationController from '../../controllers/auth.controllers';
import AuthenticationMiddleWare from '../../middlewares/profileUpdateCheck.middleware';
import app from '../../index';
import models from '../../db/models';
import { getPasswordResetToken } from '../../helpers/jwt.helper';

dotenv.config();

const { User } = models;
const { signUp } = authenticationController;
chai.use(chaiHttp);
chai.use(sinonChai);
let userToken;
let secondUserToken;
let deletedUserToken;
before(done => {
  chai
    .request(app)
    .post(`${process.env.API_VERSION}/users/signup`)
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

const { expect } = chai;

describe('Auth API endpoints', () => {
  describe('POST /users/signup', () => {
    before(async () => {
      await User.destroy({ where: {}, force: true });
    });
    before(done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/users/signup`)
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
        .post(`${process.env.API_VERSION}/users/signup`)
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
        .post(`${process.env.API_VERSION}/users/signup`)
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
        .post(`${process.env.API_VERSION}/users/signup`)
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
        .post(`${process.env.API_VERSION}/users/signup`)
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

    it('Should not allow invalid firstName user input', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'sandy@gmail.com',
          password: 'samsss',
          firstName: 23,
          lastName: 'ghghghg'
        })
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

    it('Should not allow invalid lastName user input', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'sandy@gmail.com',
          password: 'samsss',
          firstName: 'gfhshs',
          lastName: 34
        })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data[0].msg).to.equal(
            'Last name must be only alphabetical chars'
          );
          done();
        });
    });

    it('Should not allow invalid password user input', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'sandy@gmail.com',
          password: 'fgfg',
          firstName: 'gfhshs',
          lastName: 'hfjsk'
        })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data[0].msg).to.equal(
            'Password can not be less than 8 characters'
          );
          done();
        });
    });

    it('Should not allow duplicated user register', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'sandy@gmail.com',
          password: 'samsss',
          firstName: 23,
          lastName: 'ghghghg'
        })
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

    it('Should not allow invalid lastName user input', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'sandy@gmail.com',
          password: 'samsss',
          firstName: 'gfhshs',
          lastName: 34
        })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data[0].msg).to.equal(
            'Last name must be only alphabetical chars'
          );
          done();
        });
    });

    it('Should not allow invalid password user input', done => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'sandy@gmail.com',
          password: 'fgfg',
          firstName: 'gfhshs',
          lastName: 'hfjsk'
        })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data[0].msg).to.equal(
            'Password can not be less than 8 characters'
          );
          done();
        });
    });
    it('Should not allow duplicated user register', done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/users/signup`)
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
      await signUp(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('POST /users/login', () => {
    it('Should log user in successfully', async () => {
      const user = getUser();

      await createUser(user);

      const response = await chai
        .request(app)
        .post(`${process.env.API_VERSION}/users/login`)
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
        .post(`${process.env.API_VERSION}/users/login`)
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
        .post(`${process.env.API_VERSION}/users/login`)
        .send({
          email: user.email,
          password: 'limah000'
        });
      expect(response).to.have.status(400);
      expect(response.body.data.message).to.equal('Invalid email/password');
    });
  });

  describe('POST /users/forgot_password', () => {
    const endpoint = `${process.env.API_VERSION}/users/forgot_password`;
    it('should send link for password reset', async () => {
      const user = getUser();
      const { email } = user;
      user.email = email.toLowerCase();

      await createUser(user);

      const response = await chai
        .request(app)
        .post(endpoint)
        .send({ email: user.email });

      expect(response).to.have.status(201);
      expect(response.body.status).to.equal('success');
      expect(response.body.data.message).to.equal(
        'kindly check your mail for password reset instructions'
      );
    });

    it('should send link for password reset', async () => {
      const response = await chai
        .request(app)
        .post(endpoint)
        .send({ email: 'randomMal@doesnt.com' });

      expect(response).to.have.status(404);
      expect(response.body.status).to.equal('error');
      expect(response.body.error.message).to.equal('email does not exist');
    });

    it('should return error for wrong email format', async () => {
      const email = 'wrongmailformat';

      const response = await chai
        .request(app)
        .post(endpoint)
        .send({ email });

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('fail');
    });

    it('Should return an error 400 when getting all users', () => {
      const request = {};
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      authenticationController.forgotPassword(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('POST /users/password_reset', () => {
    const endpoint = `${process.env.API_VERSION}/users/password_reset`;
    it('should return an error message', async () => {
      const response = await chai
        .request(app)
        .patch(endpoint)
        .send({ password: 'password' });

      expect(response).to.have.status(401);
      expect(response.body.status).to.equal('error');
      expect(response.body.error.message).to.equal('Authentication error');
    });

    it('should return successful password reset', async () => {
      const user = getUser();
      const createdUser = await createUser(user);

      const token = await getPasswordResetToken(createdUser.dataValues);

      const response = await chai
        .request(app)
        .patch(`${endpoint}?token=${token}`)
        .send({ password: 'Password01' });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.data.message).to.equal(
        'password reset was successful'
      );
    });

    it('should return error for invalid token', async () => {
      const user = getUser();
      const createdUser = await createUser(user);

      const token = await getPasswordResetToken(createdUser.dataValues);

      const response = await chai
        .request(app)
        .patch(`${endpoint}?token=${token}makeitinvalid`)
        .send({ password: 'Password01' });

      expect(response).to.have.status(401);
      expect(response.body.status).to.equal('error');
      expect(response.body.error.message).to.equal('Authentication error');
    });

    it('should return error for wrong password format', async () => {
      const user = getUser();
      const createdUser = await createUser(user);

      const token = await getPasswordResetToken(createdUser.dataValues);

      const response = await chai
        .request(app)
        .patch(`${endpoint}?token=${token}`)
        .send({ password: 'password' });

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('fail');
    });
  });

  describe('PUT users/profileupdate', () => {
    it('Should update the provided user profile details', async () => {
      const response = await chai
        .request(app)
        .put(`${process.env.API_VERSION}/users/profileupdate`)
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
        .put(`${process.env.API_VERSION}/users/profileupdate`)
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
        .put(`${process.env.API_VERSION}/users/profileupdate`)
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
