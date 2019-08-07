/* eslint-disable default-case */
import Sequelize from 'sequelize';
import model from '../db/models';

const { Op } = Sequelize;
const { Article, User, Tag } = model;

/**
 * @method setAuthorQuery
 * Sets and applies filter query to the User model association
 * @param {string} value filter/search value
 * @returns {object} User model association
 */

const setAuthorQuery = async value => {
  return {
    model: User,
    as: 'author',
    where: {
      [Op.or]: [
        { firstName: { [Op.iLike]: `%${value}%` } },
        { lastName: { [Op.iLike]: `%${value}%` } },
        { userName: { [Op.iLike]: `%${value}%` } }
      ]
    }
  };
};

/**
 * @method setTagQuery
 * Sets and applies filter query to the Tag model association
 * @param {string} value filter/search value
 * @returns {object} Tag model association
 */

const setTagQuery = async value => {
  return {
    model: Tag,
    as: 'Tags',
    where: {
      name: { [Op.iLike]: `%${value}%` }
    }
  };
};

/**
 * @method setMessage
 * sets response message based on search result
 * @param {array} searchResult
 * @returns {string} result message
 */

const setMessage = async searchResult => {
  let message = `No Article match found`;
  if (searchResult.length > 0) {
    message = `${searchResult.length} Article match(es) found`;
  }
  return message;
};

/**
 * @method getSearchResult
 * Handles the logic for querying the database based on search input/filter provided
 * @param {boolean} multiple if number of search entry is more than one
 * @param {object|array} queryParams object of search entry query or array of search entry query objects
 * @param {boolean} hasTitle if title filter is applied to search entry
 * @returns {array} array of instance(s) of article(s) found based on filter applied
 */

const getSearchResult = async (multiple, queryParams, hasTitle) => {
  let include;

  const titleValue =
    Array.isArray(queryParams) && hasTitle
      ? queryParams.shift().title
      : queryParams.title;

  if (!multiple && hasTitle) include = undefined;
  if (!multiple && !hasTitle) include = [queryParams];
  if (multiple) include = queryParams;

  include = include
    ? [
        ...include,
        {
          model: User,
          as: 'author',
          attributes: ['firstName', 'lastName', 'image', 'email', 'userName']
        }
      ]
    : include;

  const searchResult = await Article.findAll({
    where: !hasTitle
      ? { isPublished: true }
      : {
          title: {
            [Op.iLike]: `%${titleValue}%`
          },
          isPublished: true
        },
    include
  });

  return searchResult;
};

/**
 * @method formatResponse
 * Handles the logic for formatting search results
 * @param {array} searchResult
 * @returns {object} formatted response object
 */

const formatResponse = async searchResult => {
  const mappedResult = searchResult.map(result => {
    const author = result.author
      ? {
          firstName: result.author.firstName,
          lastName: result.author.lastName,
          userName: result.author.userName,
          email: result.author.email,
          image: result.author.image
        }
      : undefined;
    const tags = result.Tags
      ? {
          name: result.Tags.map(tag => tag.name)
        }
      : undefined;

    const response = {
      id: result.id,
      title: result.title,
      slug: result.slug,
      description: result.description,
      body: result.body,
      image: result.image,
      viewsCount: result.viewsCount,
      readTime: result.readTime,
      averageRating: result.averageRating,
      sumOfRating: result.sumOfRating,
      publishedAt: result.publishedAt,
      author,
      tags
    };
    return response;
  });
  return mappedResult;
};

/**
 * @method searchBy
 * Handles the logic for filtering and searching based on parameters provided
 * @param {string} filterType type of filter applied
 * @param {string|object} value filter value or object containing filter values
 * @returns {object} search result object
 */

const searchBy = async (filterType, value) => {
  let queryObject;
  let result;
  let message;
  let hasTitle = false;
  let isMultiple = false;
  const queryObjectArray = [];
  switch (filterType) {
    case 'tag':
      queryObject = await setTagQuery(value);
      result = await getSearchResult(isMultiple, queryObject, hasTitle);
      message = await setMessage(result);
      break;
    case 'author':
      queryObject = await setAuthorQuery(value);
      result = await getSearchResult(isMultiple, queryObject, hasTitle);
      message = await setMessage(result);
      break;
    case 'title':
      hasTitle = true;
      queryObject = { title: value };
      result = await getSearchResult(isMultiple, queryObject, hasTitle);
      message = await setMessage(result);
      break;
    case 'multiple':
      isMultiple = true;
      if ('title' in value) {
        queryObjectArray.push({ title: value.title });
        hasTitle = true;
      }
      if ('author' in value) {
        const authorQuery = await setAuthorQuery(value.author);
        queryObjectArray.push(authorQuery);
      }
      if ('tag' in value) {
        const tagQuery = await setTagQuery(value.tag);
        queryObjectArray.push(tagQuery);
      }

      result = await getSearchResult(isMultiple, queryObjectArray, hasTitle);
      message = await setMessage(result);
      break;
  }

  const searchResult = await formatResponse(result);
  return { message, searchResult };
};

export default searchBy;
