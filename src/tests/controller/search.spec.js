import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';
import searchController from '../../controllers/search.controller';
import app from '../../index';
import models from '../../db/models';
import { createUser } from '../utils/db.utils';

dotenv.config();

const { Article, Tag } = models;
const { searchFilter } = searchController;
chai.use(chaiHttp);
chai.use(sinonChai);

const { expect } = chai;

let firstAuthor;
let authorFirstArticle;
let authorSecondArticle;

before(async () => {
  const user = {
    firstName: 'Jon',
    lastName: 'Bellion',
    email: 'jon@bellion.com',
    password: 'JonBee99'
  };
  firstAuthor = await createUser(user);
  await chai
    .request(app)
    .post(`${process.env.API_VERSION}/users/login`)
    .send(user);
});

before(async () => {
  authorFirstArticle = await Article.create({
    userId: firstAuthor.id,
    title: 'first article title',
    description: 'This is a description',
    body: 'lorem ipsum whatever',
    image: process.env.DEFAULT_IMAGE_URL
  });
  await authorFirstArticle.update({ isPublished: true });
  await authorFirstArticle.setTags([1]);

  authorSecondArticle = await Article.create({
    userId: firstAuthor.id,
    title: 'second article title',
    description: 'This is a description',
    body: 'lorem ipsum whatever',
    image: process.env.DEFAULT_IMAGE_URL
  });
  await authorSecondArticle.update({ isPublished: true });
  await authorSecondArticle.setTags([2]);
});

before(async () => {
  await Tag.create({
    name: 'react',
    articleId: authorFirstArticle.id
  });
  await Tag.create({
    name: 'vue',
    articleId: authorSecondArticle.id
  });
});

describe('Search And Filter Tests', () => {
  it(`Should get all articles tagged 'react'`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?tag=react`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys('message', 'searchResult');
    expect(response.body.data.searchResult[0]).to.have.keys(
      'id',
      'title',
      'slug',
      'description',
      'body',
      'publishedAt',
      'readTime',
      'image',
      'viewsCount',
      'author',
      'tags'
    );
    expect(response.body.data.searchResult[0].tags.name[0]).to.be.equal(
      'react'
    );
  });

  it(`Should return an error when a user tries to search for articles by tags without providing any tag`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?tag=`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.be.equal('fail');
    expect(response.body.data).to.have.keys('message');
    expect(response.body.data.message).to.be.equal('Tag cannot be empty');
  });

  it(`Should return an error when a user tries to search for articles by title without providing any title`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?title=`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.be.equal('fail');
    expect(response.body.data).to.have.keys('message');
    expect(response.body.data.message).to.be.equal('Title cannot be empty');
  });

  it(`Should return an error when a user tries to search for articles without providing any filter`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.be.equal('fail');
    expect(response.body.data).to.have.keys('message');
    expect(response.body.data.message).to.be.equal(
      'Filter parameters cannot be empty'
    );
  });

  it(`Should get all articles matching the author name 'Jon'`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?author=jon`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys('message', 'searchResult');
    expect(response.body.data.searchResult[0]).to.have.keys(
      'id',
      'title',
      'slug',
      'description',
      'body',
      'publishedAt',
      'readTime',
      'image',
      'author',
      'viewsCount'
    );
    expect(response.body.data.searchResult[0].author.firstName).to.be.equal(
      'Jon'
    );
    expect(response.body.data.searchResult[0].author).to.have.keys(
      'firstName',
      'lastName',
      'userName',
      'image',
      'email'
    );
  });

  it(`Should return an error when a user tries to search for articles by author without providing any author`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?author=`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.be.equal('fail');
    expect(response.body.data).to.have.keys('message');
    expect(response.body.data.message).to.be.equal('Author cannot be empty');
  });

  it(`Should return a message when a user tries to search for articles by author when there is no match`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?author=blake`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys('message', 'searchResult');
    expect(response.body.data.message).to.be.equal('No Article match found');
  });

  it(`Should get all articles matching the article title name 'first article'`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?title=first article`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys('message', 'searchResult');
    expect(response.body.data.searchResult[0]).to.have.keys(
      'id',
      'title',
      'slug',
      'description',
      'body',
      'publishedAt',
      'readTime',
      'viewsCount',
      'image'
    );
    expect(response.body.data.searchResult[0].title).to.include(
      'first article'
    );
  });

  it(`Should return a message when a user tries to search for articles by title when there is no match`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?title=no match`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys('message', 'searchResult');
    expect(response.body.data.message).to.be.equal('No Article match found');
  });

  it(`Should return an error when a user tries to search for articles providing wrong query filter`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?key='jon'`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.be.equal('fail');
    expect(response.body.data).to.have.key('message');
    expect(response.body.data.message).to.be.equal(
      `Invalid filter provided. You can only filter by 'tag', 'title' or 'author'`
    );
  });

  it(`Should get all articles matching the author name 'Jon' and tag 'vue'`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?author=jon&tag=vue`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys('message', 'searchResult');
    expect(response.body.data.message).to.be.equal('1 Article match(es) found');
    expect(response.body.data.searchResult[0]).to.have.keys(
      'id',
      'title',
      'slug',
      'description',
      'body',
      'publishedAt',
      'readTime',
      'image',
      'author',
      'viewsCount',
      'tags'
    );
    expect(response.body.data.searchResult[0].author).to.have.keys(
      'firstName',
      'lastName',
      'userName',
      'image',
      'email'
    );
    expect(response.body.data.searchResult[0].author.firstName).to.be.equal(
      'Jon'
    );
    expect(response.body.data.searchResult[0].tags.name[0]).to.be.equal('vue');
  });

  it(`Should get all articles matching the author name 'Jon' and tag 'react' and title 'first article'`, async () => {
    const response = await chai
      .request(app)
      .get(
        `${process.env.API_VERSION}/search?tag=react&author=jon&title=first article`
      );
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys('message', 'searchResult');
    expect(response.body.data.message).to.be.equal('1 Article match(es) found');
    expect(response.body.data.searchResult[0]).to.have.keys(
      'id',
      'title',
      'slug',
      'description',
      'body',
      'publishedAt',
      'readTime',
      'image',
      'tags',
      'viewsCount',
      'author'
    );
    expect(response.body.data.searchResult[0].tags.name[0]).to.be.equal(
      'react'
    );
    expect(response.body.data.searchResult[0].author.firstName).to.be.equal(
      'Jon'
    );
    expect(response.body.data.searchResult[0].title).to.include(
      'first article'
    );
  });

  it(`Should get all articles matching the tag 'vue' and title 'second article'`, async () => {
    const response = await chai
      .request(app)
      .get(`${process.env.API_VERSION}/search?tag=vue&title=second article`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.be.equal('success');
    expect(response.body.data).to.have.keys('message', 'searchResult');
    expect(response.body.data.message).to.be.equal('1 Article match(es) found');
    expect(response.body.data.searchResult[0]).to.have.keys(
      'id',
      'title',
      'slug',
      'description',
      'body',
      'publishedAt',
      'readTime',
      'image',
      'tags',
      'viewsCount',
      'author'
    );
    expect(response.body.data.searchResult[0].tags.name[0]).to.be.equal('vue');
    expect(response.body.data.searchResult[0].title).to.include(
      'second article'
    );
  });
  it('should stub an unhandled error in the search filter controller method', async () => {
    const nextCallback = sinon.spy();
    searchFilter({}, {}, nextCallback);
    sinon.assert.calledOnce(nextCallback);
  });
});
