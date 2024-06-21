import EventModel from "../models/event";
import createNextEvent from "./createNextEvent";

async function initializeEvent() {
  const pendingEvents = await EventModel.find({ status: 'pending' });

  if (pendingEvents.length === 0) {
    return createNextEvent();
  }

  if (pendingEvents.length > 1) {
    await EventModel.deleteMany({ status: 'pending' }).exec();
    return createNextEvent();
  }

  const currentEvent = pendingEvents[0];
  if (currentEvent.startDate && (currentEvent.startDate?.getTime() < new Date().getTime())) {
    await EventModel.deleteMany({ status: 'pending' }).exec();
    return createNextEvent();
  }
}

export default initializeEvent;