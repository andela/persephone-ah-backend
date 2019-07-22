import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import moment from 'moment';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';
import commentController from '../../controllers/comment.controller';
import app from '../../index';
import models from '../../db/models';
import { getUser, createUser } from '../utils/db.utils';

dotenv.config();

const { Article, Comment, User } = models;
const { getCommentHistory, getSingleComment, editComment } = commentController;
chai.use(chaiHttp);
chai.use(sinonChai);

const { expect } = chai;

let firstAuthorToken;
let secondAuthorToken;
let createUserResponse1;
let createUserResponse2;
let article1;

before(async () => {
  await Comment.destroy({ where: {}, cascade: true });
  await Article.destroy({ where: {}, cascade: true });
  await User.destroy({ where: {}, cascade: true });
});

before(async () => {
  const user = getUser();
  createUserResponse1 = await createUser(user);
  const user2 = getUser();
  createUserResponse2 = await createUser(user2);
  const response = await chai
    .request(app)
    .post(`${process.env.API_VERSION}/users/login`)
    .send(user);
  firstAuthorToken = response.body.data.token;

  const response2 = await chai
    .request(app)
    .post(`${process.env.API_VERSION}/users/login`)
    .send(user2);
  secondAuthorToken = response2.body.data.token;
});

before(async () => {
  article1 = await Article.create({
    userId: createUserResponse1.id,
    title: 'first article title',
    description: 'This is a description',
    body: 'lorem ipsum whatever',
    image: process.env.DEFAULT_IMAGE_URL,
    createdAt: moment().format(),
    updatedAt: moment().format()
  });

  await Article.create({
    userId: createUserResponse2.id,
    title: 'second article title',
    description: 'This is a description',
    body: 'lorem ipsum whatever',
    image: process.env.DEFAULT_IMAGE_URL,
    createdAt: moment().format(),
    updatedAt: moment().format()
  });
});

before(async () => {
  const body = {};
  const firstTimestamp = moment().format();
  body[firstTimestamp] = 'first comment on this article';
  await Comment.create({
    userId: createUserResponse1.id,
    articleId: article1.id,
    slug: 'first-article-title',
    body,
    createdAt: moment().format(),
    udatedAt: moment().format()
  });

  const secondTimestamp = moment().format();
  body[secondTimestamp] = 'second comment on this article';
  await Comment.create({
    userId: createUserResponse1.id,
    articleId: article1.id,
    slug: 'first-article-title',
    body,
    createdAt: moment().format(),
    udatedAt: moment().format()
  });
});

before(async () => {
  const body = {};
  const firstTimestamp = moment().format();
  body[firstTimestamp] = 'first comment on this article';
  await Comment.create({
    userId: createUserResponse1.id,
    articleId: article1.id,
    slug: 'second-article-title',
    body,
    createdAt: moment().format(),
    updatedAt: moment().format()
  });
});

describe('Comments API Endpoints', () => {
  describe('/GET /api/v1/articles/:slug/comments/:id', () => {
    it('Should get single comment record', async () => {
      const response = await chai
        .request(app)
        .get(
          `${process.env.API_VERSION}/articles/first-article-title/comments/1`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`);
      expect(response).to.have.status(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.have.keys(
        'id',
        'author',
        'createdAt',
        'updatedAt',
        'likeCount',
        'body'
      );
      expect(response.body.data.author).to.have.keys(
        'username',
        'bio',
        'image'
      );
    });

    it('Should return an error when a user tries to get a nonexistent comment record', async () => {
      const response = await chai
        .request(app)
        .get(
          `${process.env.API_VERSION}/articles/first-article-title/comments/100`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`);
      expect(response).to.have.status(404);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.keys('message');
      expect(response.body.data.message).to.be.equal(`Comment does not exist`);
    });

    it('Should return an error when a user tries to get a comment to an article with an invalid slug', async () => {
      const response = await chai
        .request(app)
        .get(
          `${process.env.API_VERSION}/articles/first-article-slug-/comments/1`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`);
      expect(response).to.have.status(400);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.keys('message');
      expect(response.body.data.message).to.be.equal(
        `Article slug is not valid`
      );
    });

    it('should call the next middleware function on unhandled error in the get single comment method', async () => {
      const nextCallback = sinon.spy();
      getSingleComment({}, {}, nextCallback);
      sinon.assert.calledOnce(nextCallback);
    });
  });
  describe('/PATCH /api/v1/articles/:slug/comments/:id', () => {
    it('Should edit a comment', async () => {
      const response = await chai
        .request(app)
        .patch(
          `${process.env.API_VERSION}/articles/first-article-title/comments/1/edit`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`)
        .send({ comment: 'This is a new edit' });
      expect(response).to.have.status(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.have.keys('comment', 'message');
      expect(response.body.data.message).to.be.equal(
        'Comment updated successfully'
      );
    });

    it(`Should get a comment's edit history`, async () => {
      const response = await chai
        .request(app)
        .get(
          `${process.env.API_VERSION}/articles/first-article-title/comments/1/history`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`);
      expect(response).to.have.status(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.data).to.have.key('commentEditHistory');
      expect(response.body.data.commentEditHistory).to.be.an('object');
    });

    it(`Should return an error if a user is trying to get the comment edit history of a non existent comment`, async () => {
      const response = await chai
        .request(app)
        .get(
          `${process.env.API_VERSION}/articles/non-existent-article-title/comments/1/history`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`);
      expect(response).to.have.status(404);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.key('message');
      expect(response.body.data.message).to.be.equal('Comment does not exist');
    });

    it(`Should return an error if a user tries to edit another user's comment`, async () => {
      const response = await chai
        .request(app)
        .patch(
          `${process.env.API_VERSION}/articles/first-article-title/comments/1/edit`
        )
        .set('Authorization', `Bearer ${secondAuthorToken}`)
        .send({ comment: 'This is a new edit' });
      expect(response).to.have.status(403);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.keys('message');
      expect(response.body.data.message).to.be.equal(
        `You don't have permission to edit this comment`
      );
    });

    it('Should return an error when a user tries to edit a nonexistent comment record', async () => {
      const response = await chai
        .request(app)
        .patch(
          `${process.env.API_VERSION}/articles/first-article-title/comments/100/edit`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`)
        .send({ comment: 'This is a new edit' });
      expect(response).to.have.status(404);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.keys('message');
      expect(response.body.data.message).to.be.equal(`Comment does not exist`);
    });

    it('Should return an error when a user tries to edit a comment to an article with an invalid slug', async () => {
      const response = await chai
        .request(app)
        .patch(
          `${process.env.API_VERSION}/articles/first-article-slug-/comments/1/edit`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`)
        .send({ comment: 'This is a new edit' });
      expect(response).to.have.status(400);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.keys('message');
      expect(response.body.data.message).to.be.equal(
        `Article slug is not valid`
      );
    });

    it('Should return an error when a user tries to edit a comment to an article providing an invalid ID', async () => {
      const response = await chai
        .request(app)
        .patch(
          `${process.env.API_VERSION}/articles/first-article-slug/comments/hey/edit`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`)
        .send({ comment: 'This is a new edit' });
      expect(response).to.have.status(400);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.keys('message');
      expect(response.body.data.message).to.be.equal(
        `Comment ID must be a number and be greater than zero`
      );
    });

    it('Should return an error when a user tries to edit a comment to an article without providing a comment', async () => {
      const response = await chai
        .request(app)
        .patch(
          `${process.env.API_VERSION}/articles/first-article-slug/comments/1/edit`
        )
        .set('Authorization', `Bearer ${firstAuthorToken}`)
        .send({ comment: '' });
      expect(response).to.have.status(400);
      expect(response.body.status).to.be.equal('fail');
      expect(response.body.data).to.have.keys('message');
      expect(response.body.data.message).to.be.equal(`Comment cannot be empty`);
    });

    it('should stub an unhandled error in the edit comment method', async () => {
      const nextCallback = sinon.spy();
      editComment({}, {}, nextCallback);
      sinon.assert.calledOnce(nextCallback);
    });
    it('should stub an unhandled error in the get comments edit history method', async () => {
      const nextCallback = sinon.spy();
      getCommentHistory({}, {}, nextCallback);
      sinon.assert.calledOnce(nextCallback);
    });
  });
});
