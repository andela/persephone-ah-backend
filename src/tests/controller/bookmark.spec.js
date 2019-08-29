import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import moment from 'moment';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';
import bookmarkController from '../../controllers/bookmark.controller';
import app from '../../index';
import models from '../../db/models';
import { createUser } from '../utils/db.utils';

dotenv.config();

const { Article } = models;
const {
  getUserBookmarks,
  removeUserBookmark,
  createBookmark
} = bookmarkController;
chai.use(chaiHttp);
chai.use(sinonChai);

const { expect } = chai;

let firstNewUserToken;
let secondNewUserToken;
let firstnewUser;
let firstArticle;
let secondArticle;

describe('Bookmarks API Endpoints', () => {
  before(async () => {
    const user = {
      firstName: 'Jon',
      lastName: 'Snow',
      email: 'jon@snow.com',
      password: 'JonBee99'
    };
    firstnewUser = await createUser(user);
    const user2 = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      password: 'JonBee99'
    };
    await createUser(user2);
    const response = await chai
      .request(app)
      .post(`${process.env.API_VERSION}/users/login`)
      .send(user);
    firstNewUserToken = response.body.data.token;

    const response2 = await chai
      .request(app)
      .post(`${process.env.API_VERSION}/users/login`)
      .send(user2);
    secondNewUserToken = response2.body.data.token;
  });

  before(async () => {
    firstArticle = await Article.create({
      userId: firstnewUser.id,
      title: 'first article title',
      description: 'This is a description',
      body: 'lorem ipsum whatever',
      image: process.env.DEFAULT_IMAGE_URL,
      createdAt: moment().format(),
      updatedAt: moment().format()
    });
    await firstArticle.update({ isPublished: true });

    secondArticle = await Article.create({
      userId: firstnewUser.id,
      title: 'second article title',
      description: 'This is a description',
      body: 'lorem ipsum whatever',
      image: process.env.DEFAULT_IMAGE_URL,
      createdAt: moment().format(),
      updatedAt: moment().format()
    });
    await secondArticle.update({ isPublished: true });
  });
  describe('/POST /api/v1/articles/:slug/bookmarks', () => {
    it(`Should add an article to a user's bookmark`, async () => {
      const response = await chai
        .request(app)
        .post(
          `${process.env.API_VERSION}/articles/${firstArticle.slug}/bookmarks`
        )
        .set('Authorization', `Bearer ${secondNewUserToken}`);
      expect(response).to.have.status(201);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.have.key('message');
      expect(response.body.data.message).to.be.equal(
        `Article added to bookmarks`
      );
    });

    it(`Should return an error if a user tries to add a previously bookmarked article to their bookmarks`, async () => {
      const response = await chai
        .request(app)
        .post(
          `${process.env.API_VERSION}/articles/${firstArticle.slug}/bookmarks`
        )
        .set('Authorization', `Bearer ${secondNewUserToken}`);
      expect(response).to.have.status(409);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.key('message');
      expect(response.body.data.message).to.be.equal(
        `Article is already in your bookmarks`
      );
    });

    it('Should return an error when a user tries to bookmark a non existent article', async () => {
      const response = await chai
        .request(app)
        .post(
          `${process.env.API_VERSION}/articles/non-existent-article-title/bookmarks`
        )
        .set('Authorization', `Bearer ${secondNewUserToken}`);
      expect(response).to.have.status(404);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.key('message');
      expect(response.body.data.message).to.be.equal(`Article does not exist`);
    });

    it('Should return an error when a user tries to bookmark an article with an invalid slug', async () => {
      const response = await chai
        .request(app)
        .post(
          `${process.env.API_VERSION}/articles/first-article-slug-/bookmarks`
        )
        .set('Authorization', `Bearer ${secondNewUserToken}`);
      expect(response).to.have.status(400);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.key('message');
      expect(response.body.data.message).to.be.equal(
        `Article slug is not valid`
      );
    });
    it('should stub an unhandled error in the create user bookmarks method', async () => {
      const nextCallback = sinon.spy();
      createBookmark({}, {}, nextCallback);
      sinon.assert.calledOnce(nextCallback);
    });
  });

  describe('/GET /api/v1/articles/bookmarks', () => {
    it(`Sholud fetch all bookmarks for a user`, async () => {
      const response = await chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles/bookmarks`)
        .set('Authorization', `Bearer ${secondNewUserToken}`);
      expect(response).to.have.status(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.have.keys(
        'firstName',
        'lastName',
        'userName',
        'bookmarks'
      );
      expect(response.body.data.bookmarks[0]).to.have.keys(
        'slug',
        'title',
        'body',
        'image',
        'likesCount',
        'isPublished',
        'viewsCount',
        'description',
        'bookmarks'
      );
    });

    it('Should return a message if a user has no bookmarks', async () => {
      const response = await chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles/bookmarks`)
        .set('Authorization', `Bearer ${firstNewUserToken}`);
      expect(response).to.have.status(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.have.key('message');
      expect(response.body.data.message).to.be.equal(
        `You currently don't have any bookmarks`
      );
    });
    it('should stub an unhandled error in the get all user bookmarks method', async () => {
      const nextCallback = sinon.spy();
      getUserBookmarks({}, {}, nextCallback);
      sinon.assert.calledOnce(nextCallback);
    });
  });

  describe('/DELETE /api/v1/articles/:slug/bookmarks', () => {
    it(`Should remove an article from a user's bookmarks`, async () => {
      const response = await chai
        .request(app)
        .delete(
          `${process.env.API_VERSION}/articles/${firstArticle.slug}/bookmarks`
        )
        .set('Authorization', `Bearer ${secondNewUserToken}`);
      expect(response).to.have.status(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.have.key('message');
      expect(response.body.data.message).to.be.equal(
        `Article has been removed from your bookmarks`
      );
    });
    it(`Should return an error when a user tries to remove an already removed article from their bookmarks`, async () => {
      const response = await chai
        .request(app)
        .delete(
          `${process.env.API_VERSION}/articles/${firstArticle.slug}/bookmarks`
        )
        .set('Authorization', `Bearer ${secondNewUserToken}`);
      expect(response).to.have.status(404);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.key('message');
      expect(response.body.data.message).to.be.equal(
        `Article is not present in your bookmarks`
      );
    });
    it('should stub an unhandled error in the remove user bookmarks method', async () => {
      const nextCallback = sinon.spy();
      removeUserBookmark({}, {}, nextCallback);
      sinon.assert.calledOnce(nextCallback);
    });
  });
});
