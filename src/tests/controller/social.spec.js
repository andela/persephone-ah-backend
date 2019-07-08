import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import {
  socialCallback,
  socialRedirect
} from '../../controllers/social.controller';
import models from '../../db/models';
import Helper from '../../services/helper';
import * as jwtHelper from '../../helpers/jwt.helper';

const { User } = models;
chai.use(sinonChai);

describe('SocialController', () => {
  afterEach(() => sinon.restore());

  describe('socialCallback', () => {
    const profileMock = {
      id: '122',
      displayName: 'john doe',
      provider: 'AH',
      photos: [{ value: 'img.io' }]
    };

    it('responds with no email', async () => {
      const done = sinon.spy();
      await socialCallback(null, null, profileMock, done);
      expect(done).calledOnceWith(null, { noEmail: true });
    });

    it('successfully authenticate and get/create user', async () => {
      const done = sinon.spy();
      profileMock.emails = [{ value: 'johndoe@mail.com' }];
      const userMock = {
        dataValues: {
          email: 'johndoe@mail.com'
        }
      };

      sinon.stub(User, 'findOrCreate').returns([userMock]);

      await socialCallback(null, null, profileMock, done);
      expect(done).calledOnceWith(null, userMock.dataValues);
    });
  });

  describe('socialRedirect', () => {
    const requestMock = { user: { noEmail: true } };
    const responseMock = {
      status() {
        return this;
      },
      json() {}
    };

    it('responds with 400 for user with no email', async () => {
      sinon.spy(Helper, 'failResponse');

      await socialRedirect(requestMock, responseMock);
      expect(Helper.failResponse).callCount(1);
      expect(Helper.failResponse).calledWith(responseMock, 400, {
        message: 'user has no email address'
      });
    });

    it('generates token for authenticated user', async () => {
      requestMock.user = {
        id: '123',
        email: 'johndoe@mail.com',
        roleType: 'guest'
      };

      const tokenMock = 'fake.token';

      sinon.spy(Helper, 'successResponse');
      sinon.stub(jwtHelper, 'getToken').returns(tokenMock);
      await socialRedirect(requestMock, responseMock);

      expect(Helper.successResponse).calledOnceWith(
        responseMock,
        200,
        tokenMock
      );
    });
  });
});
