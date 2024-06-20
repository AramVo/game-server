import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserTypeValues = ['fish', 'dolphin', 'whale'] as const;
export type UserTypes = typeof UserTypeValues[number]

const userSchema = new Schema({
  id: { type: String, unique: true, require: true },
  name: String,
  type: {
    type: String,
    enum: UserTypeValues
  }
});

const UserModel = mongoose.model('user', userSchema);

export default UserModel;