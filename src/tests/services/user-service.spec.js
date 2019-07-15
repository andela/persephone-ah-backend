import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import UserController from '../../controllers/user.controller';
import * as UserService from '../../services/user.service';
import Helper from '../../services/helper';

chai.use(sinonChai);

describe('Pagination', () => {
  afterEach(() => sinon.restore());
  describe('paginationQueryMetadata', () => {
    it('simulate server error getting users', () => {
      const responseMock = {
        status() {
          return this;
        },
        json() {}
      };
      const errorMock = {
        message: 'Custom error mock'
      };
      sinon.stub(UserService, 'getAllUsersService').throws(errorMock);
      sinon.spy(Helper, 'failResponse');

      UserController.getUsers({}, responseMock);
      expect(Helper.failResponse).calledWith(
        responseMock,
        400,
        errorMock.message
      );
    });
  });
});
