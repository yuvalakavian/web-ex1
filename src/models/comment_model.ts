import mongoose from "mongoose";

export interface IComments {
  postsId: string;
  content: string;
  senderId: string;
}

const commentSchema = new mongoose.Schema({
  postsId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
});

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
