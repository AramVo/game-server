import mongoose from "mongoose";

const Schema = mongoose.Schema;
const EventStatusValues = ['pending', 'started', 'finished'] as const;
export type EventStatuss = typeof EventStatusValues[number]

const eventSchema = new Schema({
  startDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
  status: {
    type: String,
    enum: EventStatusValues,
    require: true,
  },
});

const EventModel = mongoose.model('event', eventSchema);

export default EventModel;