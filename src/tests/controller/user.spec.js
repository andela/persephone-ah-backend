import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';
import { Response, createUser, getUser } from '../utils/db.utils';
import userController from '../../controllers/user.controller';
import app from '../../index';

dotenv.config();
const { expect, request } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);
let userToken;
let authorToken;
let authorId;

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
          expect(response.body.data).to.be.an('object');
          expect(response.body.data).to.have.property('pageResponse');
          expect(response.body.data).to.have.property('allUsers');
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

  describe('POST /users/follow/', () => {
    it('Should log user in successfully to test follow feature', async () => {
      const user = getUser();

      const createdUser = await createUser(user);
      authorId = createdUser.dataValues.id;

      const response = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send(user);
      authorToken = response.body.data.token;
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data.email).to.equal(user.email);
    });

    it('Should follow a user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/follow')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          userId: 22
        });
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data).to.equal('You have followed this user');
    });

    it('Should unfollow a user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/follow')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          userId: 22
        });
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data).to.equal('You have unfollowed this user');
    });

    it('Should return error for invalind input', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/follow')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          userId: -20
        });
      expect(response).to.have.status(400);
      expect(response).to.be.an('object');
      expect(response.body.data.message.userId).to.equal(
        'User ID must be a number'
      );
    });

    it('Should return no user found when trying to follow a user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/follow')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          userId: 565
        });
      expect(response).to.have.status(400);
      expect(response).to.be.an('object');
      expect(response.body.data).to.equal('user does not exist');
    });
  });

  describe('GET /users/follow/:userId', () => {
    it('Should follow another user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/follow')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          userId: 22
        });
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data).to.equal('You have followed this user');
    });

    it('Should follow another user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/follow')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          userId: 21
        });
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data).to.equal('You have followed this user');
    });

    it('Should follow another user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/follow')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          userId: 23
        });
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data).to.equal('You have followed this user');
    });

    it('Should get all the followers of a user', async () => {
      const response = await chai
        .request(app)
        .get(`/api/v1/users/follow/${authorId}`)
        .set('Authorization', `Bearer ${authorToken}`);
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.status).to.be.equal('success');
    });

    it('Should return invalid request for a wrong user', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/users/follow/256')
        .set('Authorization', `Bearer ${authorToken}`);
      expect(response).to.have.status(404);
      expect(response).to.be.an('object');
      expect(response.body.message).to.equal('User does not exist');
    });

    it('Should return user has no follower', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/users/follow/4')
        .set('Authorization', `Bearer ${authorToken}`);
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.status).to.equal('success');
      expect(response.body.data).to.equal('User has no follower');
    });

    it('Should return an error 500', () => {
      const requests = {};
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      userController.followUser(requests, response);
      expect(response.status).to.have.been.calledWith(400);
    });
  });
});
