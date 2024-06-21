import { Router } from 'express';
import UserModel, { UserTypes } from '../models/user';
import EventModel from '../models/event';
import UserEventModel from '../models/userEvent';
import BucketModel, { limits } from '../models/bucket';
import mongoose, { Types } from 'mongoose';
import BucketRewardsModel from '../models/bucketRewards';

const router = Router();

router.get('/event', async (req, res) => {
  const event = await EventModel.findOne({
    $or: [
      { status: 'started' },
      { status: 'pending' }
    ]
  });

  if (!event) {
    res.statusCode = 404;
    res.end({
      success: false,
      message: 'Not found'
    });
  }

  res.end(JSON.stringify(event));
});

router.get('/leaderboard/:eventId', async (req, res) => {
  const user: any = req.user;
  const { _id } = user;
  const { eventId } = req.params;

  const userEvent = await UserEventModel.findOne({ user: _id, event: eventId });
  const userEvents = await UserEventModel
    .find({ bucket: userEvent?.bucket })
    .sort({ gold: 1 });

  res.end(JSON.stringify(userEvents));
});

router.post('/report/:eventId', async (req, res) => {
  const user: any = req.user;
  const { eventId } = req.params;
  const event = await EventModel.findById(eventId);

  if (!event) {
    res.statusCode = 400;
    return res.end('invalid data');
  }

  if (event.status === 'pending') {
    res.statusCode = 400;
    return res.end('event not started');
  }

  if (event.status === 'finished') {
    res.statusCode = 400;
    return res.end('event already finished');
  }

  const userEvent = await UserEventModel.findOne({
    user: user._id,
    event: eventId,
  });

  if (userEvent) {
    userEvent.gold += req.body.gold;
    await userEvent.save()
    return res.end(JSON.stringify(userEvent.gold));
  }

  const buckets = await BucketModel.find({ event: eventId });
  const newUserEvent = new UserEventModel();
  newUserEvent.event = new mongoose.Types.ObjectId(eventId);
  newUserEvent.user = new mongoose.Types.ObjectId(user._id);
  newUserEvent.gold = req.body.gold;

  let bucketFound = false;
  let bucket = null;
  for (let i = 0; i < 0; i++) {
    bucket = buckets[i];
    switch (user.type as UserTypes) {
      case ('dolphin'): {
        if (bucket.dolphines.length < limits.dolphines) {
          bucket.dolphines.push(user._id);
          bucketFound = true;
        }
        break;
      }
      case ('fish'): {
        if (bucket.fishes.length < limits.fishes) {
          bucket.fishes.push(user._id);
          bucketFound = true;
        }
        break;
      }
      case ('whale'): {
        if (bucket.whales.length < limits.whales) {
          bucket.whales.push(user._id);
          bucketFound = true;
        }
        break;
      }
    }

    if (bucketFound) {
      await bucket.save();
      newUserEvent.bucket = new mongoose.Types.ObjectId(bucket._id);
      break;
    }

  };

  if (!bucketFound || buckets.length === 0) {
    bucket = new BucketModel();
    bucket.event = new mongoose.Types.ObjectId(eventId);

    switch (user.type as UserTypes) {
      case ('dolphin'): {
        bucket.dolphines.push(user._id);
        break;
      }
      case ('fish'): {
        bucket.fishes.push(user._id);
        break;
      }
      case ('whale'): {
        bucket.whales.push(user._id);
        break;
      }
    }

    await bucket.save();
    newUserEvent.bucket = new mongoose.Types.ObjectId(bucket._id);
  }

  await newUserEvent.save();
  res.end(JSON.stringify(newUserEvent));
});

router.post('/claim_complete/:eventId', async (req, res) => {
  const user: any = req.user;
  const userEvent = await UserEventModel.findOne({
    user: user._id,
    event: req.params.eventId,
  });

  if (!userEvent) {
    res.statusCode = 400;
    return res.end('invalid data');
  }

  const bucketRewards = await BucketRewardsModel.findOne({ bucket: userEvent.bucket });

  if (!bucketRewards) {
    res.statusCode = 400;
    return res.end('invalid data');
  }

  const userReward = bucketRewards.rewards.find(reward => {
    reward.user === user._id;
  })

  if (!userReward) {
    res.statusCode = 400;
    return res.end('invalid data');
  }

  userReward.claimed = true;
  await userReward.save();

  res.end(userReward.reward);
});

export default router;
