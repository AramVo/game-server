import { Router } from 'express';
import UserModel, { UserTypes } from '../models/user';

const router = Router();

router.post('/type/:id', async (req, res) => {
  const { type } = req.query;
  const { id } = req.params;

  try {
    await UserModel.updateOne(
      { id },
      { type },
      { runValidators: true }
    );
  } catch(err) {
    res.statusCode = 400;
    return res.end('error')
  }

  res.end('updated')
});

router.get('/', async (req, res) => {
  res.send('some users'); //for test
});

export default router;