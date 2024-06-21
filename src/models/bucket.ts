import mongoose from "mongoose"
const Schema = mongoose.Schema;
export const limits = {
  whales: 1,
  dolphines: 5,
  fishes: 10,
};

const bucketSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event',
  },
  fishes: [{
    type: Schema.Types.ObjectId,
    ref: 'userEvent',
  }],
  dolphines: [{
    type: Schema.Types.ObjectId,
    ref: 'userEvent',
  }],
  whales: [{
    type: Schema.Types.ObjectId,
    ref: 'userEvent',
  }],
});

bucketSchema.index({ event: 1 });

const BucketModel = mongoose.model('bucket', bucketSchema);

export default BucketModel;