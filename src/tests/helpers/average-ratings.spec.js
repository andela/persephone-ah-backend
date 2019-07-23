import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import averageRatings from '../../helpers/average-ratings';
import models from '../../db/models';

const { Rating } = models;

chai.use(sinonChai);

describe('Average Ratings', () => {
  afterEach(() => sinon.restore());

  describe('averageratings', () => {
    it('get the article id', async () => {
      const mockResult = {
        totalNumberOfRatings: 5,
        sumOfRatings: 15,
        averageRating: 3
      };

      const allRatingsMock = {
        rows: [
          {
            rating: 1
          },
          {
            rating: 2
          },
          {
            rating: 3
          },
          {
            rating: 4
          },
          {
            rating: 5
          }
        ],
        count: 5
      };

      sinon.stub(Rating, 'findAndCountAll').returns(allRatingsMock);
      const result = await averageRatings(1);

      expect(result).to.deep.equals(mockResult);
    });
  });
});
