import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';
import userController from '../../controllers/user.controller';
import app from '../../index';

dotenv.config();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);
let nonExistentUserToken;
let viewerToken;
before(done => {
  chai
    .request(app)
    .post(`${process.env.API_VERSION}/users/signup`)
    .send({
      firstName: 'non',
      lastName: 'existent',
      email: 'nonexistent@viewer.com',
      password: 'NewUser20'
    })
    .end((error, response) => {
      const { token } = response.body.data;
      nonExistentUserToken = token;
      done(error);
    });
});

before(`update existing user's username`, done => {
  chai
    .request(app)
    .put(`${process.env.API_VERSION}/users`)
    .set({ Authorization: `Bearer ${nonExistentUserToken}` })
    .send({
      userName: 'nonexistent'
    })
    .end(error => {
      done(error);
    });
});

describe('GET /profiles/:username', () => {
  before(done => {
    chai
      .request(app)
      .post(`${process.env.API_VERSION}/users/signup`)
      .send({
        firstName: 'view',
        lastName: 'profile',
        email: 'profile@viewer.com',
        password: 'NewUser20'
      })
      .end((error, response) => {
        const { token } = response.body.data;
        viewerToken = token;
        done(error);
      });
  });

  before(`update existing user's username`, done => {
    chai
      .request(app)
      .put(`${process.env.API_VERSION}/users`)
      .set({ Authorization: `Bearer ${viewerToken}` })
      .send({
        userName: 'viewer'
      })
      .end(error => {
        done(error);
      });
  });

  it('should fetch a user profile', async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/profiles/viewer`)
      .set('Authorization', `Bearer ${viewerToken}`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys(
      'bio',
      'firstName',
      'lastName',
      'userName',
      'image',
      'following'
    );
  });
  it('should return an error when a user tries to view a non existent profile', async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/profiles/nonexisteut`)
      .set('Authorization', `Bearer ${viewerToken}`);
    expect(response).to.have.status(404);
    expect(response.body.status).to.be.equal('fail');
    expect(response.body.data.message).to.be.equal('User does not exist');
  });

  it('should call the next middleware function on unhandled error', async () => {
    const nextCallback = sinon.spy();
    userController.viewProfile({}, {}, nextCallback);
    sinon.assert.calledOnce(nextCallback);
  });
});
