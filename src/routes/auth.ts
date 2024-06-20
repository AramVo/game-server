import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/user');
});

export default router;