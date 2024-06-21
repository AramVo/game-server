import { CronJob } from 'cron';
import mongoose from 'mongoose';

import EventModel from '../models/event';
import BucketModel from '../models/bucket';
import UserEventModel from '../models/userEvent';
import BucketRewardsModel from '../models/bucketRewards';
import initializeEvent from './eventInitializer';

const dateToCron = (date: Date) => {
	const minutes = date.getMinutes();
	const hours = date.getHours();
	const days = date.getDate();
	const months = date.getMonth() + 1;
	const dayOfWeek = date.getDay();

	return `0 ${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

// execute a job external to the javascript process (like a system command) using child_process
// this mean that we don't need manually to create new process for scheduler
async function setupCronjobs() {
	const currentEvent = await EventModel.findOne({ status: 'pending' });

	if (!currentEvent?.startDate || !currentEvent?.endDate) {
		return;
	}

	const cronTimeStart = dateToCron(currentEvent?.startDate);
	const cronTimeEnd = dateToCron(currentEvent?.endDate);

	// Will start new event every hour
	const startJob = CronJob.from({
		cronTime: cronTimeStart,
		onTick: async function () {
			console.log('cron start');
			currentEvent.status = 'started';
			await currentEvent.save();

			startJob.stop()
		},
		start: true,
	});

	// Will end event, create new event with pending status and will calculate rewards
	const finshJob = CronJob.from({
		cronTime: cronTimeEnd,
		onTick: async function () {
			console.log('cron end');
			const currentEvent = await EventModel.findOne({ status: 'started' });
			if(!currentEvent) return;

			currentEvent.status = 'finished';
			await currentEvent.save();

			const buckets = await BucketModel.find({ event: currentEvent._id });

			for(let i = 0; i < buckets.length; i++) {
				const bucket = buckets[i];
				const userEvents = await UserEventModel
					.find({ bucket: bucket._id })
					.sort({ gold: 1 });

				const bucketRewards = new BucketRewardsModel();
				bucketRewards.bucket = new mongoose.Types.ObjectId(bucket._id);
				let MaxReward = 200;
				userEvents.forEach((ue, index) => {
					bucketRewards.rewards.push({
						user: ue.user,
						reward: MaxReward - i,
					})
				});
				await bucketRewards.save()
			}

			initializeEvent()
			setupCronjobs();

			finshJob.stop();
		},
		start: true,
	});
}

export default setupCronjobs;