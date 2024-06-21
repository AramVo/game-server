import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userRewardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  reward: {
    type: Number,
    require: true,
  },
  claimed: {
    type: Boolean,
    default: false,
  }
})

const bucketRewardsSchema = new Schema({
  bucket: {
    type: Schema.Types.ObjectId,
    ref: 'bucket',
    require: true,
  },
  rewards: {
    type: [userRewardSchema],
    require: true,
  },
});

const BucketRewardsModel = mongoose.model('bucket-rewards', bucketRewardsSchema);

export default BucketRewardsModel;