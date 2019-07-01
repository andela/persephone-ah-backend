import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getUserData, Response, createUser, getUser }  from '../utils/db.utils';
import  authController from '../../controllers/auth.controllers'
import app from '../../index';
import models from '../../db/models';
const { User } = models; 


const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Auth API endpoints', () => {
  
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
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.body.status).to.equal('success');
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
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal('fail');
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
       expect(res.body).to.have.property('status');
       expect(res.body).to.have.property('data');
       expect(res.body.status).to.equal('fail');
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
         expect(res.body.data.message).to.equal('user already exists');
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
