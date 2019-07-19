import model from '../db/models';

const { Rating } = model;

const averageRatings = async articleId => {
  const allRatings = await Rating.findAndCountAll({
    where: { articleId }
  });
  const ratings = allRatings.rows;
  const totalNumberOfRatings = allRatings.count;
  let totalSum = 0;
  let oneStar = 0;
  let twoStar = 0;
  let threeStar = 0;
  let fourStar = 0;
  let fiveStar = 0;
  for (let i = 0; i < totalNumberOfRatings; i += 1) {
    const eachRating = ratings[i].rating;
    if (eachRating === 1) {
      oneStar += 1;
    } else if (eachRating === 2) {
      twoStar += 1;
    } else if (eachRating === 3) {
      threeStar += 1;
    } else if (eachRating === 4) {
      fourStar += 1;
    } else {
      fiveStar += 1;
    }
    const newSum = eachRating + totalSum;
    totalSum = newSum;
  }
  const averageRating = parseFloat(
    (totalSum / totalNumberOfRatings).toFixed(1)
  );
  const ratingsResponse = {
    totalNumberOfRatings,
    oneStar,
    twoStar,
    threeStar,
    fourStar,
    fiveStar,
    averageRating
  };
  return ratingsResponse;
};
export default averageRatings;
