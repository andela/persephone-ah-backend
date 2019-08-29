import model from '../db/models';

const { Article, Bookmark, User } = model;
/**
 * @method createBookmark
 * Interacts with the database to add an article to a user's bookmarks
 * @param {number} articleId ID of the article to be bookmarked
 * @param {number} userId ID of the user making the bookmark request
 * @returns {object|boolean} Bookmark instance object or boolean if bookmarks exists
 */

export const createBookmark = async (articleId, userId) => {
  const bookmarkExists = await Bookmark.findOne({
    where: { articleId, userId, isDeleted: false }
  });
  if (bookmarkExists) return false;

  const bookmarked = await Bookmark.create({
    articleId,
    userId
  });
  return bookmarked;
};

/**
 * @method getBookmarks
 * Interacts with the database to fetch all bookmarks for a user
 * @param {number} userId ID of the user making the bookmark request
 * @returns {object} Bookmarks response object
 */

export const getBookmarks = async userId => {
  const userBookmarks = await User.findOne({
    where: { id: userId },
    attributes: {
      exclude: [
        'id',
        'email',
        'password',
        'bio',
        'image',
        'twitterHandle',
        'facebookHandle',
        'confirmEmail',
        'confirmEmailCode',
        'isNotified',
        'isPublished',
        'passwordToken',
        'socialAuth',
        'roleType',
        'createdAt',
        'updatedAt'
      ]
    },
    include: [
      {
        model: Article,
        as: 'bookmarks',
        attributes: [
          'slug',
          'title',
          'body',
          'image',
          'likesCount',
          'isPublished',
          'viewsCount',
          'description'
        ],
        through: {
          model: Bookmark,
          as: 'bookmarks',
          where: { isDeleted: false },
          attributes: {
            exclude: ['userId', 'articleId', 'isDeleted']
          }
        }
      }
    ]
  });
  if (userBookmarks.bookmarks.length < 1) {
    return { message: `You currently don't have any bookmarks` };
  }

  if (userBookmarks.bookmarks) {
    userBookmarks.bookmarks.forEach((article, index) => {
      if (article.isPublished === false) {
        userBookmarks.bookmarks.splice(index);
      }
    });
  }
  return userBookmarks;
};

/**
 * @method removeBookmark
 * Interacts with the database to remove an article from a user's bookmarks
 * @param {number} articleId
 * @param {number} userId
 * @returns {boolean} true if article was removed from bookmarks, false if otherwise
 */

export const removeBookmark = async (articleId, userId) => {
  const bookmark = await Bookmark.findOne({
    where: { articleId, userId, isDeleted: false }
  });
  if (!bookmark) return false;
  await bookmark.update({ isDeleted: true });
  return true;
};

/**
 * @method getArticleInstance
 * Queries the database to get an article instance
 * @param {string} slug
 * @returns {object} article instance object
 */

export const getArticleInstance = async slug => {
  const articleInstance = await Article.findOne({
    where: { slug, isPublished: true }
  });
  return articleInstance;
};
