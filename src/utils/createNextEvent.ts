import EventModel from "../models/event";
import getNextEventDate from "./getNextEventDate";

async function createNextEvent() {
  const nextStartDate = getNextEventDate(true);
  const nextEndDate = getNextEventDate(false);
  const newEvent = new EventModel();

  newEvent.startDate = nextStartDate;
  newEvent.endDate = nextEndDate;
  newEvent.status = 'pending';

  return await newEvent.save();
}

export default createNextEvent;