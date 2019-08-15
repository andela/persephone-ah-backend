import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import { socialCallback } from '../../controllers/social.controller';
import models from '../../db/models';

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
    const profileMock2 = {
      id: '122',
      username: 'johndoe',
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

    it('should use default if displayname is not returned', async () => {
      const done = sinon.spy();
      profileMock2.emails = [{ value: 'johndo@mail.com' }];
      const userMock = {
        dataValues: {
          email: 'johndo@mail.com'
        }
      };

      sinon.stub(User, 'findOrCreate').returns([userMock]);

      await socialCallback(null, null, profileMock2, done);
      expect(done).calledOnceWith(null, userMock.dataValues);
    });
  });
});
