import chai from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import {
  commentArticleNotification,
  followNotification,
  likeArticleNotification,
  likeCommentNotification
} from '../../services/notification.service';

import { createUserName } from '../utils/db.utils';
import models from '../../db/models';

chai.use(chaiHttp);
chai.use(sinonChai);

const { User } = models;
const { expect } = chai;

let userA;
let userIdA;

let userB;
let userIdB;

let userC;
let userIdC;

describe('Notification service', () => {
  before('Notification test', async () => {
    const randomUserA = {
      firstName: 'Tunde',
      lastName: 'Sanusi',
      email: 'tun.sa@yahoo.com',
      userName: 'tundenu21',
      password: 'author40'
    };
    const randomUserB = {
      firstName: 'Tunde',
      lastName: 'Koma',
      email: 'tun.sako@yahoo.com',
      userName: 'tundenuko21',
      password: 'author40'
    };
    userA = await createUserName(randomUserA);
    userIdA = userA.dataValues.id;

    userB = await createUserName(randomUserB);
    userIdB = userB.dataValues.id;

    userC = await User.create({
      firstName: 'Tunde',
      lastName: 'Koma',
      email: 'tund.sako@yahoo.com',
      userName: 'tundenuko21',
      password: 'author40',
      isNotified: false
    });
    userIdC = userC.dataValues.id;
  });
  it('should return true for commentArticleNotification', async () => {
    const details = {
      userId: userIdA,
      commentUserId: userIdB,
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam',
      commentId: 5
    };
    const response = await commentArticleNotification(details);
    expect(response).to.equal(true);
  });

  it('should return true for followNotification', async () => {
    const response = await followNotification(userIdA, userIdB);
    expect(response).to.equal(true);
  });

  it('should return true likeArticleNotification', async () => {
    const details = {
      userId: userIdA,
      likeUserId: userIdB,
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam'
    };
    const response = await likeArticleNotification(details);
    expect(response).to.equal(true);
  });

  it('should return true for likeCommentNotification', async () => {
    const details = {
      userId: userIdA,
      likeUserId: userIdB,
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam',
      commentId: 5
    };
    const response = await likeCommentNotification(details);
    expect(response).to.equal(true);
  });

  // checking for errror 500
  it('should return something went wrong for commentArticleNotification with a missing value', async () => {
    const details = {
      userId: '',
      commentUserId: userIdB,
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam',
      commentId: 5
    };
    const response = await commentArticleNotification(details);
    expect(response.message).to.be.equal('something went wrong');
  });

  it('should return something went wrong for likeCommentNotification with a missing value', async () => {
    const details = {
      userId: '',
      likeUserId: userIdB,
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam',
      commentId: 5
    };
    const response = await likeCommentNotification(details);
    expect(response.message).to.be.equal('something went wrong');
  });

  it('should return something went wrong for followNotification with a missing value', async () => {
    const response = await followNotification(userIdA);
    expect(response.message).to.be.equal('something went wrong');
  });

  it('should return something went wrong for likeArticleNotification with a missing value', async () => {
    const details = {
      userId: userIdA,
      likeUserId: '',
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam'
    };
    const response = await likeArticleNotification(details);
    expect(response.message).to.be.equal('something went wrong');
  });

  // checking for false

  it('should return true for commentArticleNotification', async () => {
    const details = {
      userId: userIdC,
      commentUserId: userIdB,
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam',
      commentId: 5
    };
    const response = await commentArticleNotification(details);
    expect(response).to.equal(false);
  });

  it('should return true for followNotification', async () => {
    const response = await followNotification(userIdA, userIdC);
    expect(response).to.equal(false);
  });

  it('should return true likeArticleNotification', async () => {
    const details = {
      userId: userIdC,
      likeUserId: userIdA,
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam'
    };
    const response = await likeArticleNotification(details);
    expect(response).to.equal(false);
  });

  it('should return true for likeCommentNotification', async () => {
    const details = {
      userId: userIdC,
      likeUserId: userIdA,
      articleSlug:
        'temporibus-labore-laborum-repudiandae-vitae-rerum-debitis-ut-quidem-quisquam',
      commentId: 5
    };
    const response = await likeCommentNotification(details);
    expect(response).to.equal(false);
  });
});
