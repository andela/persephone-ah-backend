const readTime = articlesContent => {
  const wordsPerMinute = 275;
  const articlesLength = articlesContent.split(' ').length;
  const value = articlesLength / wordsPerMinute;
  if (value < 0.5) {
    return 'Less than 1 min read';
  }
  const roundUpValue = Math.ceil(value);
  return `${roundUpValue} min read`;
};
export default readTime;
