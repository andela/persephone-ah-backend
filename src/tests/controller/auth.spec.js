import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getUserData, Response }  from '../utils/db.utils';
import  authController from '../../controllers/auth.controllers'
import app from '../../index';
import models from '../../db/models';
const { User } = models; 


const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Sign Up API endpoints', () => {
  before(async()=>{
      await User.destroy({ where: {}, force: true });
   });

   it('Should successfully signup a user', (done) => {
       chai
          .request(app)
          .post('/api/v1/auth/signup')
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
     .post('/api/v1/auth/signup')
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
    .post('/api/v1/auth/signup')
    .send({ email:"sandy", password: ""})
    .end((err, res)=>{
       expect(res.status).to.equal(400);
       expect(res.body).to.have.property('errors');
       done()
      });
    });
     
    it('Should not allow duplicated user input', (done)=>{
      chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(getUserData)
      .end((err, res)=>{
         expect(res.status).to.equal(409);
         expect(res.body).to.have.property('errors');
         done()
      });
    });

    it('Should return internal serve error', async ()=> {
      const req = {
        body: {}
      };
      const res = new Response();
      sinon.stub(res, 'status').returnsThis()
      await authController.signUp(req, res);
      expect(res.status).to.have.been.calledWith(500);

    })
});
