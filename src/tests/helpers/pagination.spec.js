import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import { paginationQueryMetadata } from '../../helpers/pagination';

chai.use(sinonChai);

describe('Pagination', () => {
  afterEach(() => sinon.restore());
  describe('paginationQueryMetadata', () => {
    it('get page/limit metadata', () => {
      const mockResult = {
        limit: 10,
        offset: 0
      };

      const result = paginationQueryMetadata(1, 10);
      expect(result).to.deep.equals(mockResult);
    });

    it('uses default value for page/limit not in range', () => {
      const mockResult = {
        limit: 10,
        offset: 0
      };
      const result = paginationQueryMetadata(0, 0);
      expect(result).to.deep.equals(mockResult);
    });
  });
});
