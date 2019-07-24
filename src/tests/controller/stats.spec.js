import chai from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';
import { getArticleData } from '../utils/db.utils';
import app from '../../index';
import models from '../../db/models';

const { User } = models;

chai.use(chaiHttp);
chai.use(sinonChai);

const { expect } = chai;

let userToken;
let firstArticle;

dotenv.config();

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Page View Count Tests', () => {
  before(async () => {
    const verifiedUser = {
      firstName: 'verified',
      lastName: 'user',
      password: 'Sewtreaction2',
      email: 'user@viewstats.com'
    };
    const response = await chai
      .request(app)
      .post(`${process.env.API_VERSION}/users/signup`)
      .send(verifiedUser);
    userToken = response.body.data.token;
    const { confirmEmailCode } = await User.findOne({
      where: { email: verifiedUser.email }
    });
    // verify this user
    await chai
      .request(app)
      .get(`${process.env.API_VERSION}/users/verify/${confirmEmailCode}`)
      .set({ Authorization: `Bearer ${userToken}` });
  });

  before(done => {
    chai
      .request(app)
      .post(`${process.env.API_VERSION}/articles`)
      .send(getArticleData())
      .set({ Authorization: `Bearer ${userToken}` })
      .end((error, response) => {
        firstArticle = response.body.data;
        done();
      });
  });

  beforeEach(async () => {
    await chai
      .request(app)
      .put(`${process.env.API_VERSION}/articles/publish/${firstArticle.slug}`)
      .set({ Authorization: `Bearer ${userToken}` });
  });

  it('Should successfully increase the view count this article by 1', done => {
    chai
      .request(app)
      .get(`${process.env.API_VERSION}/articles/${firstArticle.slug}`)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response).to.be.an('Object');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('data');
        expect(response.body.status).to.equal('success');
        expect(response.body.data.title).to.equal('new article');
        expect(response.body.data.description).to.equal(
          'this is a description'
        );
        expect(response.body.data.body).to.equal(
          'this is a description this is a description'
        );
        expect(response.body.data.viewsCount).to.equal(1);
        done();
      });
  });
  it('Should return page view count of 2 for this article', done => {
    chai
      .request(app)
      .get(`${process.env.API_VERSION}/articles/${firstArticle.slug}`)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response).to.be.an('Object');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('data');
        expect(response.body.status).to.equal('success');
        expect(response.body.data.title).to.equal('new article');
        expect(response.body.data.description).to.equal(
          'this is a description'
        );
        expect(response.body.data.body).to.equal(
          'this is a description this is a description'
        );
        expect(response.body.data.viewsCount).to.equal(2);
        done();
      });
  });

  it('Should return page view count of 2 for this article', done => {
    chai
      .request(app)
      .get(`${process.env.API_VERSION}/articles/${firstArticle.slug}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response).to.be.an('Object');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('data');
        expect(response.body.status).to.equal('success');
        expect(response.body.data.title).to.equal('new article');
        expect(response.body.data.description).to.equal(
          'this is a description'
        );
        expect(response.body.data.body).to.equal(
          'this is a description this is a description'
        );
        expect(response.body.data.viewsCount).to.equal(2);
        done();
      });
  });

  it('Should return reading stats for user', done => {
    chai
      .request(app)
      .get(`${process.env.API_VERSION}/articles/stats`)
      .set({ Authorization: `Bearer ${userToken}` })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response).to.be.an('Object');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('data');
        expect(response.body.status).to.equal('success');
        expect(response.body.data[0].title).to.equal('new article');
        expect(response.body.data[0].description).to.equal(
          'this is a description'
        );
        expect(response.body.data[0].viewsCount).to.equal(2);
        done();
      });
  });
});
