import express from 'express';
import articleValidator from '../../validators/article.validator';
import articleController from '../../controllers/article.controller';
import PaginationValidator from '../../validators/pagination.validator';
import authorization from '../../middlewares/auth.middleware';
import upload from '../../middlewares/imageUpload.middleware';

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

const { verifyToken } = authorization;

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

  .get('/:slug/comments', allArticleComments)
  .delete(
    '/:slug/comments/:commentId',
    verifyToken,
    validator('delete-comment'),
    checkValidationResult,
    deleteComment
  );
export default router;
