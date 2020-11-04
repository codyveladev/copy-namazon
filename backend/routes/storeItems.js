const express = require("express");
import mongoose from "mongoose";

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const router = express.Router();

router.use(session({
        secret: "mySecret",
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
      }))

//import model
import { storeItem } from "../models/storeItemModel";

/**
 * @route GET /storeItems/:storeItemID
 * @desc will return a single item given an ID
 */
router.get("/search/:id", async (req, res) => {
  const foundItem = await storeItem.findById(req.params.id);

    if (!req.session.lastItemViewed) {
      req.session.lastItemViewed = [foundItem];
    } else {
      req.session.lastItemViewed.push(foundItem);
    }

    res.send(foundItem); 
    
});

/**
 * @route GET /storeItems/search/?query=abc
 * @desc Get all items that satisfy the regular expression query (or all items if no query)
 */
router.get("/search", async (req, res) => {
  if (req.query.title) {
    let foundItemByTitle = await storeItem.find({
      title: { $regex: req.query.title, $options: "i" },
    });

    res.send(foundItemByTitle);
  } else if (req.query.description) {
    let foundItemByDesc = await storeItem.find({
      description: { $regex: req.query.description, $options: "i" },
    });

    res.send(foundItemByDesc);
  } else if (req.query.price) {
    let foundItemByPrice = await storeItem.find({
      price: req.query.price,
    });

    res.send(foundItemByPrice);
  } else if (req.query.stock) {
    let foundItemByStock = await storeItem.find({
      stock: req.query.stock,
    });

    res.send(foundItemByStock);
  } else {
    // send back all items if no matching query is found.
    const foundAllItems = await storeItem.find();

    res.send(foundAllItems);
  }
});

/**
 * @route GET /StoreItem/Recent?num=10
 * @desc Get the last 10 viewed items.
 */
router.get("/Recent", (req, res) => {
  let amountOfItemsToView = req.query.num
  let resultOfQuery = []

  for(let i = 0; i < amountOfItemsToView; i++){
    resultOfQuery.push(req.session.lastItemViewed[i]);
  }
  res.send(resultOfQuery)

});

/**
 * @route POST /storeItems/newItem
 * @desc will add a new store item to the collection
 * @ignore for init database purposes.
 */
router.post("/newItem", (req, res) => {
  const newItem = new storeItem(req.body);

  //save to the database
  newItem.save();

  //send it back saying its been made
  res.send(newItem);
});

module.exports = router;
