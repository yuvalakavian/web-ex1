import mongoose from "mongoose";

export interface IUsres {
  username: string;
  email: string;
  fullname: string;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
