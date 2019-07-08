import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {
  Response,
  createUser,
  adminData,
  getUser,
  createSuperAdmin
} from '../utils/db.utils';
import userController from '../../controllers/user.controller';
import app from '../../index';
import models from '../../db/models';

const { User } = models;
const { expect, request } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);
let userToken;
let superAdminToken;

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

  describe('POST /users/create_admin', () => {
    before(async () => {
      await User.destroy({ where: {}, force: true });
      await createSuperAdmin();
    });

    it('Should log user in successfully', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'koya@gmail.com',
          password: 'author40'
        });
      superAdminToken = response.body.data.token;
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data.email).to.equal('koya@gmail.com');
    });

    it('Should successfully create an admin user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/create_admin')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(adminData);
      expect(response.status).to.equal(201);
      expect(response).to.be.an('Object');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('data');
      expect(response.body.status).to.equal('success');
      expect(response.body.data.firstName).to.equal(adminData.firstName);
      expect(response.body.data.lastName).to.equal(adminData.lastName);
      expect(response.body.data.email).to.equal(
        adminData.email.toLocaleLowerCase()
      );
    });

    it('Should return user exist when creating an admin a user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/create_admin')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(adminData);
      expect(response).to.have.status(409);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.be.equal('user already exists');
    });

    it('Should return an error 500', () => {
      const requests = {};
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      userController.adminCreateUser(requests, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });
  describe('DELETE /users/:userId', () => {
    before(async () => {
      await User.destroy({ where: {}, force: true });
      await createSuperAdmin();
    });

    it('Should log user in successfully', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'koya@gmail.com',
          password: 'author40'
        });
      superAdminToken = response.body.data.token;
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data.email).to.equal('koya@gmail.com');
    });

    it('Should successfully delete a user', async () => {
      const user = getUser();

      const createdUser = await createUser(user);

      const userId = createdUser.dataValues.id;

      const response = await chai
        .request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.be.equal(
        `user with email ${user.email} deleted successfully`
      );
    });

    it('Should return no user found on delete', async () => {
      const response = await chai
        .request(app)
        .delete('/api/v1/users/788')
        .set('Authorization', `Bearer ${superAdminToken}`);
      expect(response).to.have.status(400);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.be.equal('User not found');
    });

    it('Should return an error 500', () => {
      const requests = {};
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      userController.adminDeleteUser(requests, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });
  describe('PUT /users/update/:userId', () => {
    before(async () => {
      await User.destroy({ where: {}, force: true });
      await createSuperAdmin();
    });

    it('Should log user in successfully', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'koya@gmail.com',
          password: 'author40'
        });
      superAdminToken = response.body.data.token;
      expect(response).to.have.status(200);
      expect(response).to.be.an('object');
      expect(response.body.data.email).to.equal('koya@gmail.com');
    });

    it('Should successfully update a user', async () => {
      const user = getUser();

      const createdUser = await createUser(user);

      const userId = createdUser.dataValues.id;

      const response = await chai
        .request(app)
        .put(`/api/v1/users/update/${userId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          firstName: 'John',
          lastName: 'Paul'
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data.firstName).to.be.equal('John');
      expect(response.body.data.lastName).to.be.equal('Paul');
      expect(response.body.data.email).to.be.equal(user.email);
    });

    it('Should return no user found on update', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/update/788')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          firstName: 'John',
          lastName: 'Paul'
        });
      expect(response).to.have.status(400);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.be.equal('User not found');
    });

    it('Should return error for invalid input on update', async () => {
      const user = getUser();

      const createdUser = await createUser(user);

      const userId = createdUser.dataValues.id;

      const response = await chai
        .request(app)
        .put(`/api/v1/users/update/${userId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          firstName: '23',
          lastName: 'Paul'
        });
      expect(response).to.have.status(500);
      expect(response.body).to.be.an('object');
      expect(response.body.error).to.be.equal('SequelizeValidationError');
      expect(response.body.message).to.be.equal(
        'Validation error: Please enter a valid character'
      );
    });
  });
});
