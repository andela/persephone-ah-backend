import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
<<<<<<< HEAD
import { getUserData, Response, createUser, getUser }  from '../utils/db.utils';
import  authController from '../../controllers/auth.controllers'
import app from '../../index';
import models from '../../db/models';
const { User } = models; 

=======
import { getUserData, Response, createUser, getUser } from '../utils/db.utils';
import authController from '../../controllers/auth.controllers';
import app from '../../index';
import models from '../../db/models';

const { User } = models;
>>>>>>> 8ac798e770c9c9aa5ad960ed4964d818ede285b2

const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Auth API endpoints', () => {
<<<<<<< HEAD
  
describe('POST /users/signup', () => {
  before(async()=>{
      await User.destroy({ where: {}, force: true });
   });

   it('Should successfully signup a user', (done) => {
       chai
          .request(app)
          .post('/api/v1/users/signup')
          .send(getUserData)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res).to.be.an('Object');
            expect(res.body).to.have.property('user');
            done()
          });
   });

   it('Should not allow null user input for sign up', (done)=>{
     chai
     .request(app)
     .post('/api/v1/users/signup')
     .send({})
     .end((err, res)=>{
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('errors');
        done()
     });    
   });

   it('Should not allow invalid user input', (done)=>{
    chai
    .request(app)
    .post('/api/v1/users/signup')
    .send({ email:"sandy", password: ""})
    .end((err, res)=>{
       expect(res.status).to.equal(400);
       expect(res.body).to.have.property('errors');
       done()
      });
    });
     
    it('Should not allow duplicated user register', (done)=>{
      chai
      .request(app)
      .post('/api/v1/users/signup')
      .send(getUserData)
      .end((err, res)=>{
         expect(res.status).to.equal(409);
         expect(res.body).to.have.property('errors');
         done()
      });
    });

    it('Should return internal server error', async ()=> {
      const req = {
        body: {}
      };
      const res = new Response();
      sinon.stub(res, 'status').returnsThis()
      await authController.signUp(req, res);
      expect(res.status).to.have.been.calledWith(500);

    })
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
    expect(response.body.message).to.equal('Invalid credentials');
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
    expect(response.body.message).to.equal('Invalid credentials');
  });
});
});
=======
  describe('POST /users/signup', () => {
    before(async () => {
      await User.destroy({ where: {}, force: true });
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
});
>>>>>>> 8ac798e770c9c9aa5ad960ed4964d818ede285b2
