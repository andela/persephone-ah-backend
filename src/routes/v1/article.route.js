import express from 'express';
import articleValidator from '../../validators/article.validator';
import articleController from '../../controllers/article.controller';
import authorization from '../../middlewares/auth.middleware';
import upload from '../../middlewares/imageUpload.middleware';
import { pageViewCount } from '../../middlewares/pageViewCount.middleware';
import stats from '../../controllers/readingStat.controller';

const { validator, checkValidationResult } = articleValidator;
const { verifyToken, isAuthor } = authorization;
const { readingStats } = stats;
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

const router = express.Router();
router.get('/stats', verifyToken, readingStats);
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
  .get('/:slug', isAuthor, pageViewCount, getArticle)
  .get('/', getAllPublishedArticles)
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
  );
export default router;
