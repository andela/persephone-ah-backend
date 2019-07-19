import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';

import articleModel from '../../db/models/article';

describe('src/models/article', () => {
  const Article = articleModel(sequelize, dataTypes);
  const article = new Article();

  checkModelName(Article)('Article');

  context('properties', () => {
    [
      'title',
      'body',
      'description',
      'slug',
      'isPublished',
      'isDeleted',
      'image'
    ].forEach(checkPropertyExists(article));
  });
});
