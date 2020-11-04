import mongoose from "mongoose";

const Schema = mongoose.Schema;

const storeItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
  },
});

export const storeItem = mongoose.model("storeItem", storeItemSchema);
