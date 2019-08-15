import express from 'express';
import articleValidator from '../../validators/article.validator';
import articleController from '../../controllers/article.controller';
import PaginationValidator from '../../validators/pagination.validator';
import authorization from '../../middlewares/auth.middleware';
import upload from '../../middlewares/imageUpload.middleware';
import commentController from '../../controllers/comment.controller';
import commentsCheck from '../../middlewares/commentsCheck.middleware';
import reportController from '../../controllers/report.controller';
import { pageViewCount } from '../../middlewares/pageViewCount.middleware';
import stats from '../../controllers/readingStat.controller';
import bookmarkController from '../../controllers/bookmark.controller';
import bookmarksCheckMiddleware from '../../middlewares/bookmarkCheck.middleware';
import reactions from '../../controllers/reaction.controller';

const { validator, checkValidationResult } = articleValidator;
const { verifyToken, isAuthor, adminCheck, verifyUser } = authorization;

const { articlesLike } = reactions;

const { readingStats } = stats;
const {
  validator: paginationValidator,
  checkValidationResult: ValidationResult
} = PaginationValidator;

const {
  createComment,
  allArticleComments,
  deleteComment,
  createArticle,
  getArticle,
  getAllPublishedArticles,
  updateArticle,
  deleteArticle,
  publishArticle,
  userGetAllPublishedArticles,
  unPublishArticle,
  getUserPublishedArticles,
  userGetAllDraftArticles,
  likeComment,
  fetchTags
} = articleController;

const { getCommentHistory, editComment, getSingleComment } = commentController;
const { editCommentCheck, getArticlesCommentsCheck } = commentsCheck;

const {
  createBookmark,
  getUserBookmarks,
  removeUserBookmark
} = bookmarkController;

const { createReport, removeArticle } = reportController;
const { bookmarkCheck } = bookmarksCheckMiddleware;
const router = express.Router();
router.get('/stats', verifyToken, readingStats);
router
  .post(
    '/',
    verifyToken,
    verifyUser,
    upload.array('image'),
    validator('create'),
    checkValidationResult,
    createArticle
  )
  .get('/tags', fetchTags)
  .post(
    '/:slug/comments',
    verifyToken,
    validator('comment'),
    checkValidationResult,
    createComment
  )
  .get('/draft', verifyToken, userGetAllDraftArticles)
  .get('/bookmarks', verifyToken, getUserBookmarks)
  .get('/publish', verifyToken, userGetAllPublishedArticles)
  .get('/publish/:userId', getUserPublishedArticles)
  .get(
    '/',
    paginationValidator()('pagination'),
    ValidationResult,
    getAllPublishedArticles
  )
  .get('/:slug', isAuthor, pageViewCount, getArticle)
  .get('/', getAllPublishedArticles)
  .put('/publish/:slug', verifyToken, publishArticle)
  .put('/unpublish/:slug', verifyToken, unPublishArticle)
  .put('/:slug', verifyToken, upload.array('image'), updateArticle)
  .delete('/:slug', verifyToken, deleteArticle)
  .post(
    '/ratings',
    verifyToken,
    validator('rating'),
    checkValidationResult,
    articleController.ratings
  )
  .get('/:slug/comments', allArticleComments)
  .delete(
    '/:slug/comments/:commentId',
    verifyToken,
    validator('delete-comment'),
    checkValidationResult,
    deleteComment
  )
  .get(
    '/:articleId/ratings',
    verifyToken,
    validator('fetchRating'),
    checkValidationResult,
    paginationValidator()('pagination'),
    ValidationResult,
    articleController.fetchRatings
  )
  .post(
    '/:slug/reports',
    verifyToken,
    validator('remove-article'),
    checkValidationResult,
    createReport
  )
  .delete(
    '/:slug/remove-article',
    verifyToken,
    adminCheck,
    checkValidationResult,
    removeArticle
  )
  .get(
    '/:slug/comments/:commentId/reactions',
    verifyToken,
    validator('commentLike'),
    checkValidationResult,
    likeComment,
    authorization.verifyToken,
    validator('fetchRating'),
    checkValidationResult,
    articleController.fetchRatings
  );

router.get(
  '/:slug/comments/:id',
  verifyToken,
  getArticlesCommentsCheck,
  getSingleComment
);
router.get(
  '/:slug/comments/:id/history',
  verifyToken,
  getArticlesCommentsCheck,
  getCommentHistory
);
router.get('/:articleId/reactions', verifyToken, articlesLike);
router.patch(
  '/:slug/comments/:id/edit',
  verifyToken,
  editCommentCheck,
  editComment
);
router.post('/:slug/bookmarks', verifyToken, bookmarkCheck, createBookmark);
router.delete(
  '/:slug/bookmarks',
  verifyToken,
  bookmarkCheck,
  removeUserBookmark
);

export default router;
