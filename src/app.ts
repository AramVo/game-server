import express from "express";
import session from "express-session";
import passport from "passport";

import authRouter from './routes/auth';
import userRouter from './routes/user';

const app = express();

app.use(session({
  secret: process.env.COOCKIE_SECRET || '',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.use('/auth', authRouter);

function requireUser(req: any, res: any, next: any) {
  if (!req.user) {
    return next(new Error('Uninitialized'))
  };
  next();
}

app.use('/user', requireUser, userRouter);

export default app;