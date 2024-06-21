import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from 'body-parser';


import authRouter from './routes/auth';
import userRouter from './routes/user';
import gameRouter from './routes/game';
import requireUser from "./middleware/requireUser";

const app = express();

app.use(session({
  secret: process.env.COOCKIE_SECRET || '',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/auth', authRouter);

app.use(requireUser)
app.use('/user', userRouter);
app.use('/game', gameRouter);

export default app;