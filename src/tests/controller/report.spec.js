import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import faker from 'faker';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Response, createUser, getUser } from '../utils/db.utils';
import reportController from '../../controllers/report.controller';
import app from '../../index';
import models from '../../db/models';

dotenv.config();

const API = process.env.API_VERSION;

const { Article } = models;
const { expect, request } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);
let secondUserToken;
let authorUserId;
let author;
let firstArticle;
let secondArticle;
let superAdminToken;

describe('User API endpoints', () => {
  before(async () => {
    const userA = getUser();
    const userB = getUser();
    author = await createUser(userA);
    await createUser(userB);
    authorUserId = author.dataValues.id;

    const response = await chai
      .request(app)
      .post(`${process.env.API_VERSION}/users/login`)
      .send({
        email: 'koya@gmail.com',
        password: 'author40'
      });
    superAdminToken = response.body.data.token;
  });
  before('sign up a random user', async () => {
    const randomUser = getUser();
    await request(app)
      .post('/api/v1/users/signup')
      .send(randomUser);
  });
  before(done => {
    const randomUser = getUser();
    chai
      .request(app)
      .post(`${process.env.API_VERSION}/users/signup`)
      .send(randomUser);
    done();
  });

  before(done => {
    const secondRandomUser = getUser();
    chai
      .request(app)
      .post(`${process.env.API_VERSION}/users/signup`)
      .send(secondRandomUser)
      .end((error, response) => {
        secondUserToken = response.body.data.token;
        done();
      });
  });

  before(async () => {
    firstArticle = await Article.create({
      userId: authorUserId,
      title: faker.lorem.sentence(10, 1),
      description: faker.lorem.sentence(15, 3),
      body: faker.lorem.paragraphs(50)
    });
    secondArticle = await Article.create({
      userId: authorUserId,
      title: faker.lorem.sentence(10, 1),
      description: faker.lorem.sentence(15, 3),
      body: faker.lorem.paragraphs(50),
      deletedAt: '2019-07-13 10:13:23.656+01'
    });

    await Article.create({
      userId: authorUserId,
      title: faker.lorem.sentence(10, 1),
      description: faker.lorem.sentence(15, 3),
      body: faker.lorem.paragraphs(50)
    });
  });
  describe('POST /:slug/reports', async () => {
    it('should create a report', async () => {
      const response = await chai
        .request(app)
        .post(`${API}/articles/${firstArticle.slug}/reports`)
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .send({
          reason: 'This article is guilty of plagarism'
        });
      expect(response.status).to.be.equal(201);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.author.firstName).to.be.equal(
        author.dataValues.firstName
      );
      expect(response.body.data.author.lastName).to.be.equal(
        author.dataValues.lastName
      );
    });
    it('should create a report', async () => {
      const response = await chai
        .request(app)
        .post(`${API}/articles/${firstArticle.slug}/reports`)
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .send({
          reason: 'This article should be taken down for conspiracy'
        });
      expect(response.status).to.be.equal(201);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.author.firstName).to.be.equal(
        author.dataValues.firstName
      );
      expect(response.body.data.author.lastName).to.be.equal(
        author.dataValues.lastName
      );
    });

    it('should return no article found', async () => {
      const response = await chai
        .request(app)
        .delete(`${API}/articles/damilola/remove-article`)
        .set({ Authorization: `Bearer ${superAdminToken}` });
      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.be.equal('article not found');
    });

    it('should return no article found already taken down article', async () => {
      const response = await chai
        .request(app)
        .delete(`${API}/articles/${secondArticle.slug}/remove-article`)
        .set({ Authorization: `Bearer ${superAdminToken}` });
      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.be.equal('article not found');
    });
    it('Should return an error 500', () => {
      const requests = {};
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      reportController.createReport(requests, response);
      expect(response.status).to.have.been.calledWith(500);
    });
    it('Should return an error 400 testing', () => {
      const requests = {
        user: {
          id: 22
        },
        params: {
          slug: 'damilola'
        },
        body: {
          reason: 'article'
        }
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      reportController.createReport(requests, response);
    });
  });

  describe('DELETE /:slug/remove-article', async () => {
    it('should remove an article', async () => {
      const response = await chai
        .request(app)
        .delete(`${API}/articles/${firstArticle.slug}/remove-article`)
        .set({ Authorization: `Bearer ${superAdminToken}` });
      expect(response.status).to.be.equal(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.title).to.be.equal(firstArticle.title);
      expect(response.body.data.slug).to.be.equal(firstArticle.slug);
      expect(response.body.data.description).to.be.equal(
        firstArticle.description
      );
    });
    it('should return no article found', async () => {
      const response = await chai
        .request(app)
        .delete(`${API}/articles/${firstArticle.slug}/remove-article`)
        .set({ Authorization: `Bearer ${superAdminToken}` });
      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.be.equal('article not found');
    });
    it('Should return an error 500', () => {
      const requests = {};
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      reportController.removeArticle(requests, response);
      expect(response.status).to.have.been.calledWith(400);
    });
    // it('should create a report', async () => {
    //   const response = await chai
    //     .request(app)
    //     .post(`${API}/articles/${firstArticle.slug}/reports`)
    //     .set({ Authorization: `Bearer ${secondUserToken}` })
    //     .send({
    //       reason: 'This article should be taken down for conspiracy'
    //     });
    //   expect(response.status).to.be.equal(201);
    //   expect(response.body.data).to.be.an('object');
    //   expect(response.body.data.author.firstName).to.be.equal(
    //     author.dataValues.firstName
    //   );
    //   expect(response.body.data.author.lastName).to.be.equal(
    //     author.dataValues.lastName
    //   );
    // });
    // it('Should return an error 500', () => {
    //   const requests = {};
    //   const response = new Response();
    //   sinon.stub(response, 'status').returnsThis();
    //   reportController.createReport(requests, response);
    //   expect(response.status).to.have.been.calledWith(500);
    // });
  });
});
