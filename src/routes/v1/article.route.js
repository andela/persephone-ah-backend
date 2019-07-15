import express from 'express';
import ArticleValidator from '../../validators/article.validator';
import articleController from '../../controllers/article.controller';
import authorization from '../../middlewares/auth.middleware';
import upload from '../../middlewares/imageUpload.middleware';

const { validator, checkValidationResult } = ArticleValidator;
const { verifyToken } = authorization;
const {
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
router
  .post(
    '/',
    verifyToken,
    upload.array('image'),
    validator('create'),
    checkValidationResult,
    createArticle
  )
  .get('/draft', verifyToken, userGetAllDraftArticles)
  .get('/publish', verifyToken, userGetAllPublishedArticles)
  .get('/publish/:userId', getUserPublishedArticles)
  .get('/:slug', getArticle)
  .get('/', getAllPublishedArticles)
  .put('/publish/:slug', verifyToken, publishArticle)
  .put('/unpublish/:slug', verifyToken, unPublishArticle)
  .put('/:slug', verifyToken, upload.array('image'), updateArticle)
  .delete('/:slug', verifyToken, deleteArticle);

export default router;
