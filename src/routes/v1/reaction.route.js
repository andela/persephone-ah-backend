import express from 'express';
import reactions from '../../controllers/reaction.controller';
import authorization from '../../middlewares/auth.middleware';
import reactionValidator from '../../validators/reaction.validator';

const { articlesLike } = reactions;
const { verifyToken } = authorization;
const { validator, checkValidationResult } = reactionValidator;

const router = express.Router();

router.post(
  '/article/:postId',
  validator('article'),
  checkValidationResult,
  verifyToken,
  articlesLike
);

export default router;
