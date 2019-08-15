import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';
import faker from 'faker';

import {
  getArticleData,
  Response,
  getUser,
  createUser,
  mockCreateArticle,
  createComment
} from '../utils/db.utils';
import articleController from '../../controllers/article.controller';
import app from '../../index';
import * as imageHelper from '../../helpers/image.helper';
import models from '../../db/models';

const { User } = models;
const {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  userGetAllDraftArticles,
  userGetAllPublishedArticles,
  getUserPublishedArticles,
  unPublishArticle
} = articleController;

chai.use(chaiHttp);
chai.use(sinonChai);

const { API_VERSION } = process.env;

const { expect } = chai;

let userToken;
let secondUserToken;
let createdArticle;
let secondArticle;
let thirdArticle;
let mockImage;
let sixthArticle;

dotenv.config();

const API = process.env.API_VERSION;

const { Article } = models;

chai.use(chaiHttp);
chai.use(sinonChai);
let authorUserId;
let author;
let commentId;
let commentSlug;
let secondCommentId;
let secondCommentSlug;

describe('Article API endpoints', () => {
  before(async () => {
    const userA = getUser();
    const userB = getUser();
    author = await createUser(userA);
    await createUser(userB);
    authorUserId = author.dataValues.id;
  });

  before(async () => {
    const verifiedUser = {
      firstName: 'verified',
      lastName: 'user',
      password: 'Sewtywei12',
      email: 'user@verified.com'
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

  before(done => {
    chai
      .request(app)
      .post(`${process.env.API_VERSION}/articles`)
      .send(getArticleData())
      .set({ Authorization: `Bearer ${userToken}` })
      .end((error, response) => {
        secondArticle = response.body.data;
        done();
      });
  });

  before(done => {
    chai
      .request(app)
      .post(`${process.env.API_VERSION}/articles`)
      .send(getArticleData())
      .set({ Authorization: `Bearer ${userToken}` })
      .end((error, response) => {
        thirdArticle = response.body.data;
        done();
      });
  });

  before(done => {
    chai
      .request(app)
      .post(`${process.env.API_VERSION}/articles`)
      .send(getArticleData())
      .set({ Authorization: `Bearer ${userToken}` })
      .end(() => {
        done();
      });
  });

  before(async () => {
    sixthArticle = await Article.create({
      userId: authorUserId,
      title: faker.lorem.sentence(10, 1),
      description: faker.lorem.sentence(15, 3),
      slug: faker.lorem.slug(3),
      body: faker.lorem.paragraphs(50)
    });

    await Article.create({
      userId: authorUserId,
      title: faker.lorem.sentence(10, 1),
      description: faker.lorem.sentence(15, 3),
      slug: faker.lorem.slug(3),
      body: faker.lorem.paragraphs(50)
    });
  });

  describe('POST /articles', () => {
    after(() => {
      mockImage.restore();
    });

    it('Should successfully create an article', done => {
      mockImage = sinon
        .stub(imageHelper, 'upload')
        .resolves('./src/tests/testFiles/default_avatar.png');
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/articles`)
        .set({ Authorization: `Bearer ${userToken}` })
        .field('title', 'first article')
        .field('description', 'this is a description')
        .field('body', 'this is a description this is a description')
        .attach(
          'image',
          './src/tests/testFiles/default_avatar.png',
          'image.jpeg'
        )
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.title).to.equal('first article');
          expect(response.body.data.description).to.equal(
            'this is a description'
          );
          expect(response.body.data.body).to.equal(
            'this is a description this is a description'
          );
          done();
        });
    });

    it('Should successfully create an article', done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/articles`)
        .set({ Authorization: `Bearer ${userToken}` })
        .field('title', 'first article')
        .field('description', 'this is a description')
        .field('body', 'this is a description this is a description')
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.title).to.equal('first article');
          expect(response.body.data.description).to.equal(
            'this is a description'
          );
          expect(response.body.data.body).to.equal(
            'this is a description this is a description'
          );
          done();
        });
    });

    it('Should successfully create an article', done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/articles`)
        .set({ Authorization: `Bearer ${userToken}` })
        .field('title', 'first article')
        .field('description', 'this is a description')
        .field('body', 'this is a description this is a description')
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.title).to.equal('first article');
          expect(response.body.data.description).to.equal(
            'this is a description'
          );
          expect(response.body.data.body).to.equal(
            'this is a description this is a description'
          );
          done();
        });
    });
    it('Should successfully create an article with tags', done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/articles`)
        .set({ Authorization: `Bearer ${userToken}` })
        .field('title', 'first article')
        .field('description', 'this is a description')
        .field('body', 'this is a description this is a description')
        .field('tag', 'javascript, php, java')
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.title).to.equal('first article');
          expect(response.body.data.description).to.equal(
            'this is a description'
          );
          expect(response.body.data.body).to.equal(
            'this is a description this is a description'
          );
          expect(response.body.data.tagList[0]).to.equal('javascript');
          expect(response.body.data.tagList[1]).to.equal('php');
          expect(response.body.data.tagList[2]).to.equal('java');
          done();
        });
    });

    it('Should return an error if request is empty', done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/articles`)
        .set({ Authorization: `Bearer ${userToken}` })
        .field('title', 'first article')
        .field('description', 'this is a description')
        .field('body', 'this is a description this is a description')
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.title).to.equal('first article');
          expect(response.body.data.description).to.equal(
            'this is a description'
          );
          expect(response.body.data.body).to.equal(
            'this is a description this is a description'
          );
          done();
        });
    });

    it('Should successfully create an article', done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/articles`)
        .set({ Authorization: `Bearer ${userToken}` })
        .field('title', 'first article')
        .field('description', 'this is a description')
        .field('body', 'this is a description this is a description')
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.title).to.equal('first article');
          expect(response.body.data.description).to.equal(
            'this is a description'
          );
          expect(response.body.data.body).to.equal(
            'this is a description this is a description'
          );
          createdArticle = response.body.data;
          done();
        });
    });
    it('Should return an error if user is not authorized', done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/articles`)
        .send({})
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data[0].msg).to.equal(
            'Please enter your title for this post'
          );
          expect(response.body.data[1].msg).to.equal(
            'Please enter valid content for this article'
          );
          done();
        });
    });

    it('Should return internal server error', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await createArticle(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });

    it('Should return internal server error', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await createArticle(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('GET All draft Articles by user /articles/draft', () => {
    it('Should successfully fetch all draft articles by user', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles/draft`)
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data[1].title).to.equal('new article');
          expect(response.body.data[1].description).to.equal(
            'this is a description'
          );
          expect(response.body.data[1].body).to.equal(
            'this is a description this is a description'
          );
          done();
        });
    });
    it('Should return an error 500', async () => {
      const requests = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await userGetAllDraftArticles(requests, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('PUT Publish Articles by user /articles/publish/:slug', () => {
    it('Should successfully publish articles by user', done => {
      chai
        .request(app)
        .put(`${process.env.API_VERSION}/articles/publish/${thirdArticle.slug}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.message).to.equal(
            'Article published successfully'
          );
          done();
        });
    });

    it('Should successfully publish articles by user', done => {
      chai
        .request(app)
        .put(
          `${process.env.API_VERSION}/articles/publish/${secondArticle.slug}`
        )
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.message).to.equal(
            'Article published successfully'
          );
          done();
        });
    });

    it('Should return an error if slug is invalid', done => {
      chai
        .request(app)
        .put(
          `${process.env.API_VERSION}/articles/publish/these-are-oranges-23423`
        )
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal('Article does not exist');
          done();
        });
    });

    it('Should return an error if user is not authorized', done => {
      chai
        .request(app)
        .post(`${process.env.API_VERSION}/articles`)
        .send({})
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('error');
          expect(response.body.status).to.equal(400);
          expect(response.body.error).to.equal(
            'No token provided, you do not have access to this page'
          );
          done();
        });
    });

    it('Should return an error if user is unauthorized', done => {
      chai
        .request(app)
        .put(`${process.env.API_VERSION}/articles/publish/${thirdArticle.slug}`)
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .send(getArticleData())
        .end((error, response) => {
          expect(response.status).to.equal(403);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal(
            'Forbidden, you can not publish this resource'
          );
          done();
        });
    });

    it('Should return internal server error', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await createArticle(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('GET All published Articles by user /articles/publish', () => {
    it('Should successfully fetch all published articles by user', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles/publish`)
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
          expect(response.body.data[0].body).to.equal(
            'this is a description this is a description'
          );
          done();
        });
    });

    it('Should return an error 500', async () => {
      const requests = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await userGetAllPublishedArticles(requests, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('GET All published Articles by a specific user /articles/publish/:userId', () => {
    it('Should successfully fetch all published articles by user', done => {
      chai
        .request(app)
        .get(
          `${process.env.API_VERSION}/articles/publish/${createdArticle.userId}`
        )
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
          expect(response.body.data[0].body).to.equal(
            'this is a description this is a description'
          );
          done();
        });
    });

    it('Should return an error 500', async () => {
      const requests = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await getUserPublishedArticles(requests, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('GET All published Articles /articles', () => {
    it('Should successfully fetch all published articles', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles`)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.allArticles[0].title).to.equal(
            'first article title'
          );
          expect(response.body.data.allArticles[0].description).to.equal(
            'This is a description'
          );
          expect(response.body.data.allArticles[0].body).to.equal(
            'lorem ipsum whatever'
          );
          done();
        });
    });
    it('Should use deafult vaules for page and query if they are set to zero', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles?page=0&limit=0`)
        .end((error, response) => {
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.allArticles[0].title).to.equal(
            'first article title'
          );
          done();
        });
    });
    it('Should return error if invalid query', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles?page=a&limit=a`)
        .end((error, response) => {
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data[0].msg).to.equal('Page must be a number');
          done();
        });
    });
    it('Should use return no content on this page if page given in query does not exist', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles?page=20&limit=10`)
        .end((error, response) => {
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.pageResponse).to.equal(
            'No content on this page'
          );
          done();
        });
    });
  });

  describe('PUT Unpublish Articles by user /articles/unpublish/:slug', () => {
    it('Should successfully unpublish articles by user', done => {
      chai
        .request(app)
        .put(
          `${process.env.API_VERSION}/articles/unpublish/${thirdArticle.slug}`
        )
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.message).to.equal(
            'Article unpublished successfully'
          );
          done();
        });
    });

    it('Should return an error if slug is invalid', done => {
      chai
        .request(app)
        .put(
          `${process.env.API_VERSION}/articles/unpublish/these-are-oranges-23423`
        )
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal('Article does not exist');
          done();
        });
    });

    it('Should return an error if user is unauthorized', done => {
      chai
        .request(app)
        .put(
          `${process.env.API_VERSION}/articles/unpublish/${thirdArticle.slug}`
        )
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .send(getArticleData())
        .end((error, response) => {
          expect(response.status).to.equal(403);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal(
            'Forbidden, you can not publish this resource'
          );
          done();
        });
    });

    it('Should return internal server error', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await publishArticle(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });

    it('Should return an error 500', async () => {
      const requests = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await unPublishArticle(requests, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('GET single article /articles/:slug', () => {
    it('Should successfully publish articles by user', done => {
      chai
        .request(app)
        .put(
          `${process.env.API_VERSION}/articles/publish/${secondArticle.slug}`
        )
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.message).to.equal(
            'Article published successfully'
          );
          done();
        });
    });

    it('Should successfully fetch a single article', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles/${secondArticle.slug}`)
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
          done();
        });
    });

    it('Should return an error if slug is invalid', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles/these-are-oranges-23423`)
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal('Article does not exist');
          done();
        });
    });

    it('Should return internal server error', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await getArticle(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('PUT update article /articles/:slug', () => {
    after(() => {
      mockImage.restore();
    });

    it('Should return an error if slug is invalid', done => {
      chai
        .request(app)
        .put(`${process.env.API_VERSION}/articles/these-are-oranges-23423`)
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal('Article does not exist');
          done();
        });
    });

    it('Should return an error if no token is provided', done => {
      chai
        .request(app)
        .put(`${process.env.API_VERSION}/articles/${createdArticle.slug}`)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.equal(
            'No token provided, you do not have access to this page'
          );
          done();
        });
    });

    it('Should return an error if user is unauthorized', done => {
      chai
        .request(app)
        .put(`${process.env.API_VERSION}/articles/${createdArticle.slug}`)
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .send(getArticleData())
        .end((error, response) => {
          expect(response.status).to.equal(403);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal(
            'Forbidden, you can not edit this resource'
          );
          done();
        });
    });

    it('Should successfully update a single article', done => {
      mockImage = sinon
        .stub(imageHelper, 'upload')
        .resolves('./src/tests/testFiles/default_avatar.png');
      chai
        .request(app)
        .put(`${process.env.API_VERSION}/articles/${createdArticle.slug}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .field('title', 'changed new title')
        .field('description', 'this is a description')
        .field('body', 'this is a description this is a description')
        .attach(
          'image',
          './src/tests/testFiles/default_avatar.png',
          'image.jpeg'
        )
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.title).to.equal('changed new title');
          expect(response.body.data.description).to.equal(
            'this is a description'
          );
          done();
        });
    });

    it('Should return internal server error', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await updateArticle(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('DELETE delete article /articles/:slug', () => {
    it('Should return an error if slug is invalid', done => {
      chai
        .request(app)
        .delete(`${process.env.API_VERSION}/articles/these-are-oranges-23423`)
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal('Article does not exist');
          done();
        });
    });

    it('Should return an error if user is unauthorized', done => {
      chai
        .request(app)
        .delete(`${process.env.API_VERSION}/articles/${secondArticle.slug}`)
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(403);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('fail');
          expect(response.body.data.message).to.equal(
            'Forbidden, you can not delete this resource'
          );
          done();
        });
    });

    it('Should successfully delete a single article', done => {
      chai
        .request(app)
        .delete(`${process.env.API_VERSION}/articles/${secondArticle.slug}`)
        .set({ Authorization: `Bearer ${userToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response).to.be.an('Object');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('data');
          expect(response.body.status).to.equal('success');
          expect(response.body.data.message).to.equal(
            'Article deleted successfully'
          );
          done();
        });
    });

    it('Should return internal server error', async () => {
      const request = {
        body: {}
      };
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await deleteArticle(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('POST /:slug/comments', async () => {
    it('should create a comment', async () => {
      const response = await chai
        .request(app)
        .post(`${API}/articles/${sixthArticle.slug}/comments`)
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .send({
          body: 'I love this article'
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
    it('should create a comment', async () => {
      const response = await chai
        .request(app)
        .post(`${API}/articles/${sixthArticle.slug}/comments`)
        .set({ Authorization: `Bearer ${secondUserToken}` })
        .send({
          body: 'I love this article'
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
    it('should create a comment', async () => {
      const response = await chai
        .request(app)
        .post(`${API}/articles/${sixthArticle.slug}/comments`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          body: faker.lorem.sentence(8, 2),
          highlightedText: faker.lorem.sentence(12, 4)
        });

      commentId = response.body.data.id;
      commentSlug = response.body.data.slug;
      expect(response.status).to.be.equal(201);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.author.firstName).to.be.equal(
        author.dataValues.firstName
      );
      expect(response.body.data.author.lastName).to.be.equal(
        author.dataValues.lastName
      );
    });
    it('should create a comment', async () => {
      const response = await chai
        .request(app)
        .post(`${API}/articles/${sixthArticle.slug}/comments`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          body: faker.lorem.sentence(8, 2),
          highlightedText: faker.lorem.sentence(12, 4)
        });
      secondCommentId = response.body.data.id;
      secondCommentSlug = response.body.data.slug;
      expect(response.status).to.be.equal(201);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.author.firstName).to.be.equal(
        author.dataValues.firstName
      );
      expect(response.body.data.author.lastName).to.be.equal(
        author.dataValues.lastName
      );
    });

    it('should return 404 for a non existing article', async () => {
      const response = await chai
        .request(app)
        .post(`${API}/articles/damilola-adekoya/comments`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          body: faker.lorem.sentence(8, 2),
          highlightedText: faker.lorem.sentence(12, 4)
        });
      expect(response.status).to.be.equal(404);
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('no article found');
    });

    it('Should return an error 500', async () => {
      const requests = {};
      const response = new Response();
      sinon.stub(response, 'status').returnsThis();
      await articleController.createComment(requests, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('GET /:slug/comments', () => {
    it('should get all the comments of an article', async () => {
      const response = await chai
        .request(app)
        .get(`${API}/articles/${sixthArticle.slug}/comments`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(response.status).to.be.equal(201);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.article.id).to.be.equal(
        sixthArticle.dataValues.id
      );
      expect(response.body.data.article.title).to.be.equal(
        sixthArticle.dataValues.title
      );
      expect(response.body.data.article.slug).to.be.equal(
        sixthArticle.dataValues.slug
      );
      expect(response.body.data.article.description).to.be.equal(
        sixthArticle.dataValues.description
      );
    });

    it('should return article not found', async () => {
      const response = await chai
        .request(app)
        .get(`${API}/articles/damilola-persephone/comments`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.be.equal('article not found');
    });
  });

  describe('DELETE /:slug/comments/:id', async () => {
    it('should delete a comment', async () => {
      const response = await chai
        .request(app)
        .delete(`${API}/articles/${commentSlug}/comments/${commentId}`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(response.status).to.be.equal(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.article.id).to.be.equal(
        sixthArticle.dataValues.id
      );
      expect(response.body.data.article.title).to.be.equal(
        sixthArticle.dataValues.title
      );
      expect(response.body.data.article.slug).to.be.equal(
        sixthArticle.dataValues.slug
      );
      expect(response.body.data.article.description).to.be.equal(
        sixthArticle.dataValues.description
      );
    });

    it('should return comment not found', async () => {
      const response = await chai
        .request(app)
        .delete(`${API}/articles/some-slug/comments/34`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(response.status).to.be.equal(400);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body).to.be.an('object');
      expect(response.body.data).to.be.equal('comment not found');
    });

    it('should not allow a user delete another user comment', async () => {
      const response = await chai
        .request(app)
        .delete(
          `${API}/articles/${secondCommentSlug}/comments/${secondCommentId}`
        )
        .set({ Authorization: `Bearer ${secondUserToken}` });
      expect(response.status).to.be.equal(400);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body).to.be.an('object');
      expect(response.body.data).to.be.equal(
        "you can not delete another user's comment"
      );
    });

    it('should delete a comment', async () => {
      const response = await chai
        .request(app)
        .delete(`${API}/articles/${commentSlug}/comments/damilola`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(response.status).to.be.equal(400);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data[0].msg).to.be.equal('Invalid value');
    });
  });

  describe('/articles/ratings', () => {
    before(async () => {
      const user = getUser();

      const signupResponse = await chai
        .request(app)
        .post(`${API_VERSION}/users/signup`)
        .send(user);
      userToken = signupResponse.body.data.token;
    });
    const endpoint = `${API_VERSION}/articles/ratings`;

    describe('# error and success article rating case', () => {
      let article;

      it('should create a new rating for a specified article', async () => {
        const user = getUser();

        const userResult = await createUser(user);

        article = await mockCreateArticle(userResult.id);

        const response = await chai
          .request(app)
          .post(endpoint)
          .set({ Authorization: `Bearer ${userToken}` })
          .send({ articleId: article.id, rating: 4 });

        expect(response).to.have.status(201);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.articleId).to.equal(article.id);
      });

      it('should return error that user can not rate more than once', async () => {
        const response = await chai
          .request(app)
          .post(endpoint)
          .set({ Authorization: `Bearer ${userToken}` })
          .send({ articleId: article.id, rating: 4 });
        expect(response).to.have.status(400);
        expect(response.body.status).to.equal('fail');
        expect(response.body.data).to.equal(
          'you are only allowed to rate this article once'
        );
      });
    });

    it('should return 404 for no article found', async () => {
      const response = await chai
        .request(app)
        .post(endpoint)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ articleId: 455, rating: 4 });
      expect(response).to.have.status(404);
      expect(response.body.status).to.equal('fail');
      expect(response.body.data.message).to.equal(
        'The article specified does not exist'
      );
    });

    it('should return error for invalid token', async () => {
      const user = getUser();

      const userResult = await createUser(user);

      const article = await mockCreateArticle(userResult.id);

      const response = await chai
        .request(app)
        .post(endpoint)
        .set({ Authorization: `Bearer ${userToken}touchtoken` })
        .send({ articleId: article.id, rating: 0 });

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal(400);
      expect(response.body.error).to.equal('invalid signature');
    });

    it('should return error for rating that is less than one', async () => {
      const user = getUser();

      const userResult = await createUser(user);

      const article = await mockCreateArticle(userResult.id);

      const response = await chai
        .request(app)
        .post(endpoint)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ articleId: article.id, rating: 0 });

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('fail');
      expect(response.body.data[0].msg).to.equal(
        'Rating must be greater than 0'
      );
    });

    it('should return error for no token provided', async () => {
      const user = getUser();

      const userResult = await createUser(user);

      const article = await mockCreateArticle(userResult.id);

      const response = await chai
        .request(app)
        .post(endpoint)
        .send({ articleId: article.id, rating: 4 });

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal(400);
      expect(response.body.error).to.equal(
        'No token provided, you do not have access to this page'
      );
    });

    it('should return error for article id that is less than 1', async () => {
      const response = await chai
        .request(app)
        .post(endpoint)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ articleId: 0, rating: 4 });

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('fail');
      expect(response.body.data[0].msg).to.equal(
        'Article ID must be greater than 0'
      );
    });
  });

  describe('GET /articles/:articleId/ratings', () => {
    let article;

    before('first before hook for fetch ratings', async () => {
      const user = getUser();

      const userResult = await createUser(user);

      article = await mockCreateArticle(userResult.id);

      const signupResponse = await chai
        .request(app)
        .post(`${API_VERSION}/users/login`)
        .send(user);
      userToken = signupResponse.body.data.token;
    });

    before('second before hook fetch ratings', async () => {
      await chai
        .request(app)
        .post(`${API_VERSION}/articles/ratings`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ articleId: article.id, rating: 4 });
    });

    it('should return ratings for a specified article id', async () => {
      const response = await chai
        .request(app)
        .get(`${API_VERSION}/articles/${article.id}/ratings`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(response).to.have.status(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.data.allRatings[0].articleId).to.equal(article.id);
    });

    it('should return error for article id that is less than 1', async () => {
      const response = await chai
        .request(app)
        .get(`${API_VERSION}/articles/-1/ratings`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('fail');
      expect(response.body.data[0].msg).to.equal(
        'Article ID must be a number and can not be less than 1'
      );
    });

    it('should return error for article id that not a number', async () => {
      const response = await chai
        .request(app)
        .get(`${API_VERSION}/articles/notNumber/ratings`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('fail');
      expect(response.body.data[0].msg).to.equal('Invalid value');
    });

    it('should return error for no token provided', async () => {
      const response = await chai
        .request(app)
        .get(`${API_VERSION}/articles/${article.id}/ratings`);

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal(400);
      expect(response.body.error).to.equal(
        'No token provided, you do not have access to this page'
      );
    });
  });

  describe('POST /articles/:slug/comments/commentId/reactions', () => {
    let article, comment;

    before(async () => {
      const user = getUser();

      const userResult = await createUser(user);

      article = await mockCreateArticle(userResult.id);

      comment = await createComment(userResult.id, article.id, article.slug);

      const signupResponse = await chai
        .request(app)
        .post(`${API_VERSION}/users/login`)
        .send(user);
      userToken = signupResponse.body.data.token;
    });

    it('should return error for no token provided', async () => {
      const response = await chai
        .request(app)
        .get(
          `${API_VERSION}/articles/${article.slug}/comments/${comment.id}/reactions`
        );

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal(400);
      expect(response.body.error).to.equal(
        'No token provided, you do not have access to this page'
      );
    });

    it('should like a specific comment', async () => {
      const response = await chai
        .request(app)
        .get(
          `${API_VERSION}/articles/${article.slug}/comments/${comment.id}/reactions`
        )
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.data.message).to.equal(
        'you have successfully liked this comment'
      );
    });

    it('should dislike a specific comment', async () => {
      const response = await chai
        .request(app)
        .get(
          `${API_VERSION}/articles/${article.slug}/comments/${comment.id}/reactions`
        )
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.data.message).to.equal(
        'you have successfully unliked this comment'
      );
    });

    it('should return error that the specified comment id does not exist', async () => {
      const response = await chai
        .request(app)
        .get(
          `${API_VERSION}/articles/${
            article.slug
          }/comments/${1212121}/reactions`
        )
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response).to.have.status(404);
      expect(response.body.status).to.equal('fail');
      expect(response.body.data.message).to.equal(
        'The comment with the specified id does not exist'
      );
    });

    it('should return error that the comment id is less than 1', async () => {
      const response = await chai
        .request(app)
        .get(`${API_VERSION}/articles/${article.slug}/comments/${0}/reactions`)
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('fail');
      expect(response.body.data[0].msg).to.equal(
        'Comment ID must be greater than 0'
      );
    });

    it('should return error that the specified article slug does not exist', async () => {
      const response = await chai
        .request(app)
        .get(
          `${API_VERSION}/articles/${
            article.slug
          }slugifault/comments/${1}/reactions`
        )
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response).to.have.status(404);
      expect(response.body.status).to.equal('fail');
      expect(response.body.data.message).to.equal(
        'The article with the specified slug does not exist'
      );
    });
  });

  describe('GET /articles/tags', () => {
    it('should return all tags in record', async () => {
      const response = await chai
        .request(app)
        .get(`${API_VERSION}/articles/tags`);

      expect(response).to.have.status(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.data.length).greaterThan(0);
    });
  });
});
