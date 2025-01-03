import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  fullname: string,
  password: string;
  _id?: string;
  refreshToken?: string[];
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: [String],
        default: [],
    },
    createdAt: { 
        type: Date,
         default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);
