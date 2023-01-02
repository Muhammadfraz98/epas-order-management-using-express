//
import mongoose from "mongoose";
import validator from "validator";

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  supplierStatus: {
    type: Boolean,
    default: false,
  },

  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fileLink: {
    type: String,
    required: false,
  },

  status: {
    type: String,
    require: false,
  },
  isPending: {
    type: Boolean,
    default: true,
  },

  IsVerified: {
    type: Boolean,
    default: false,
  },

  userId: {
    type: String,
    require: false,
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
});

const orders = mongoose.model("Order", orderSchema);

export default orders;
