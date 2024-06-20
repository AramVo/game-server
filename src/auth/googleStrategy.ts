import passport from 'passport';
import passportGoogleOauth20 from 'passport-google-oauth20';

import UserModel from '../models/user';

passport.serializeUser((user, done) => {
  done(null, (user as any).id)
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findOne({ id });
  done(null, user);
});

const GoogleStrategy = passportGoogleOauth20.Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  callbackURL: "http://localhost:3000/auth/google/callback",
},
  async (accessToken, refreshToken, profile, cb) => {
    const user = await UserModel.findOne({ id: profile.id });

    if (user) {
      return cb(null, user);
    }

    const newUser = await UserModel.create({
      id: profile.id,
      name: profile.displayName,
    })
    cb(null, newUser)
  }
));