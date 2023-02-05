//
import mongoose from "mongoose";
import validator from "validator";

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordToken: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    require: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    require: true,
  },
  emailVerifiedToken: {
    type: String,
    require: false,
  },
  passwordResetToken: {
    type: String,
    require: false,
  },

  IsVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    require: false,
  },
});

const User = mongoose.model("Users", UserSchema);

export default User;
