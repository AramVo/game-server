import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userEventSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event'
  },
  bucket: {
    type: Schema.Types.ObjectId,
    ref: 'bucket'
  },
  gold: Number,
});

userEventSchema.index({ event: 1, bucket: 1 });

const userEventModel = mongoose.model('userEvent', userEventSchema);

export default userEventModel;