import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getArticleData, Response, getUser } from '../utils/db.utils';
import articlesController from '../../controllers/article.controller';
import app from '../../index';
import * as imageHelper from '../../helpers/image.helper';

const {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  publishArticle
} = articlesController;
chai.use(chaiHttp);
chai.use(sinonChai);

const { expect } = chai;

let userToken;
let secondUserToken;
let createdArticle;
let secondArticle;
let thirdArticle;
let mockImage;

describe('Articles API endpoints', () => {
  before(done => {
    const randomUser = getUser();
    chai
      .request(app)
      .post(`${process.env.API_VERSION}/users/signup`)
      .send(randomUser)
      .end((error, response) => {
        userToken = response.body.data.token;
        done();
      });
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
          createdArticle = response.body.data;
          done();
        });
    });

    it('Should return an error if request is empty', done => {
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
      await publishArticle(request, response);
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
  });
  describe('GET single article /articles/:slug', () => {
    it('Should successfully fetch a single article', done => {
      chai
        .request(app)
        .get(`${process.env.API_VERSION}/articles/${createdArticle.slug}`)
        .end((error, response) => {
          expect(response.status).to.equal(200);
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
});
