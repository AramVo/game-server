import 'dotenv/config';
import mongoose from 'mongoose';

import './auth/googleStrategy';
import app from './app';
import initializeEvent from './utils/eventInitializer';

async function main() {
  await mongoose.connect(process.env.DB_URL || '');
  console.log('connected to db');

  await initializeEvent();

  app.listen(process.env.PORT, () => {
    console.log('listening to port: ', process.env.PORT);
  });
}

main();
