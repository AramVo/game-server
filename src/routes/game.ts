import { Router } from 'express';
import UserModel, { UserTypes } from '../models/user';

const router = Router();

router.get('/event', async (req, res) => {
});

router.get('/leaderboard/:eventId', async (req, res) => {
});

router.post('/report/:eventId', async (req, res) => {
});

router.post('/claim_complete/:eventId', async (req, res) => {
});

export default router;
