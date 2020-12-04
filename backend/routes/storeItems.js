const express = require("express");
const axios = require("axios");
import mongoose from "mongoose";

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const router = express.Router();

router.use(
  session({
    secret: "mySecret",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//import model
const storeData = require("../models/storeItemModel");

router.get("/all", async (req, res) => {
  let storeItems = await storeData.find();

  res.send(storeItems);
});

/**
 * @route GET /storeItems/:storeItemID
 * @desc will return a single item given an ID
 */
router.get('/:StoreItemID', async (req, res) => {
    try {
        const storeItem = await storeData.findById(req.params.StoreItemID);
        if (storeItem) {
            if (!req.session.last10) {
                req.session.last10 = [];
            }
            req.session.last10.push(storeItem);
            if (req.session.last10.length > 10) {
                req.session.last10.shift();
            }
            return res.send(storeItem);
        }
        res.send(404);
    } catch (err) {
        res.send(400);
    }
});


/**
 * @route GET /storeItems/search/?query=abc
 * @desc Get all items that satisfy the regular expression query (or all items if no query)
 */
router.get("/search", async (req, res) => {
  try {
    const re = new RegExp(req.query.query);
    let foundStoreItems = await storeData.find({
      $or: [{ description: re }, { name: re }],
    });
    res.send(foundStoreItems);
  } catch (err) {
    res.send(400);
  }
});

/**
 * @route GET /StoreItem/Recent?num=10
 * @desc Get the last 10 viewed items.
 */
router.get("/recent", (req, res) => {
  return res.send(req.session.last10 || "");
});

/**
 * @route POST /storeItems/newItem
 * @desc will add a new store item to the collection
 * @ignore for init database purposes.
 */
router.post("/newItem", async (req, res) => {
  let sampleData = [];

  for (let i = 1; i <= 20; i++) {
    await axios.get(`https://fakestoreapi.com/products/${i}`).then((res) => {
      if (res.data == null) {
        i = 20;
      } else {
        sampleData.push(res.data);
      }
    });
  }

  for (let i = 0; i < sampleData.length; i++) {
    if (sampleData[i] !== null) {
      const newItem = new storeData({
        title: sampleData[i].title,
        price: sampleData[i].price,
        description: sampleData[i].description,
        image: sampleData[i].image,
        quantity: Math.floor(Math.random() * 16) + 5,
      });

      //save to the database
      newItem.save();
    } else {
      break;
    }
  }

  //send it back saying its been made
  res.send("store items populated!");
});

module.exports = router;
