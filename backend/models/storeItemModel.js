const mongoose = require("mongoose");
const storeData = mongoose.model(
  "StoreItem",
  new mongoose.Schema({
    quantity: Number,
    description: String,
    title: String,
    image: String,
    price: Number, 
  })
);

module.exports = storeData;
