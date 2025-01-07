import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string;
  _id?: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model<IUser>("User", userSchema);
export default userModel;
