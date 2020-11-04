import mongoose from "mongoose";
const Schema = mongoose.Schema;
const cartSchema = require("./cartModel");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  cart: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("users", userSchema);
