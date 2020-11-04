const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  CartUser: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "storeItem",
    },
  ],
});

export const Cart = mongoose.model("Cart", cartSchema);
