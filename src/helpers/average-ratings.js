/**
 * @method averageRatings
 * - Helps update the article table
 *
 * @param {integer} articleId - Id of the article to be rated
 *
 * @return {Object} ratingDetails
 */

import model from '../db/models';

const { Rating } = model;

const averageRatings = async articleId => {
  const allRatings = await Rating.findAndCountAll({
    where: { articleId }
  });

  let totalSum = 0;

  for (let i = 0; i < allRatings.count; i += 1) {
    const eachRating = allRatings.rows[i].rating;
    const newSum = eachRating + totalSum;
    totalSum = newSum;
  }
  const averageRating =
    parseFloat((totalSum / allRatings.count).toFixed(1)) || 0;
  const ratingDetails = {
    totalNumberOfRatings: allRatings.count,
    sumOfRatings: totalSum,
    averageRating
  };
  return ratingDetails;
};
export default averageRatings;
