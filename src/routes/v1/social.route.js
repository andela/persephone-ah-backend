import express from 'express';
import passport from 'passport';
import { socialRedirect } from '../../controllers/social.controller';

const router = express.Router();

router
  .get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
  .get(
    '/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    socialRedirect
  );

router
  .get('/twitter', passport.authenticate('twitter', { scope: ['email'] }))
  .get(
    '/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    socialRedirect
  );

router
  .get(
    '/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
  )
  .get('/google/callback', passport.authenticate('google'), socialRedirect);

export default router;
