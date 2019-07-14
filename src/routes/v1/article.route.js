import express from 'express';
import articleValidator from '../../validators/article.validator';
import articleController from '../../controllers/article.controller';
import PaginationValidator from '../../validators/pagination.validator';
import authorization from '../../middlewares/auth.middleware';
import upload from '../../middlewares/imageUpload.middleware';
import commentController from '../../controllers/comment.controller';
import commentsCheck from '../../middlewares/commentsCheck.middleware';
import reportController from '../../controllers/report.controller';

const { validator, checkValidationResult } = articleValidator;

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
  userGetAllDraftArticles
} = articleController;

const { getCommentHistory, editComment, getSingleComment } = commentController;

const { editCommentCheck, getArticlesCommentsCheck } = commentsCheck;

const { verifyToken, adminCheck } = authorization;

const { createReport, removeArticle } = reportController;

const router = express.Router();
router
  .post(
    '/',
    verifyToken,
    upload.array('image'),
    validator('create'),
    checkValidationResult,
    createArticle
  )
  .post(
    '/:slug/comments',
    verifyToken,
    validator('comment'),
    checkValidationResult,
    createComment
  )
  .get('/draft', verifyToken, userGetAllDraftArticles)
  .get('/publish', verifyToken, userGetAllPublishedArticles)
  .get('/publish/:userId', getUserPublishedArticles)
  .get('/:slug', getArticle)
  .get(
    '/',
    paginationValidator()('pagination'),
    ValidationResult,
    getAllPublishedArticles
  )
  .put('/publish/:slug', verifyToken, publishArticle)
  .put('/unpublish/:slug', verifyToken, unPublishArticle)
  .put('/:slug', verifyToken, upload.array('image'), updateArticle)
  .delete('/:slug', verifyToken, deleteArticle)
  .post(
    '/ratings',
    authorization.verifyToken,
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
    authorization.verifyToken,
    validator('fetchRating'),
    checkValidationResult,
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
router.patch(
  '/:slug/comments/:id/edit',
  verifyToken,
  editCommentCheck,
  editComment
);

export default router;
