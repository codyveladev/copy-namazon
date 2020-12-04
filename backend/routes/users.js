const express = require("express");
const router = express.Router();

//Load user model
const userData = require("../models/userModel");
const cartData = require("../models/cartModel");

/**
 * @route /users/
 * @desc will find all of the users in the database
 *
 */
router.get("/", async (req, res) => {
  let foundUsers = await User.find();

  res.send(foundUsers);
});

/**
 * @route GET /users/:id
 * @desc Will return a user given a specific ID
 *
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await userData.findById(req.params.id).populate([
      {
        path: "cart",
        model: "Cart",
        populate: {
          path: "cartItems.storeItem",
          model: "StoreItem",
        },
      },
    ]);
    if (req.userJwt.user._id !== user.id) {
      return res.send(403);
    }
    res.send(user || 404);
  } catch (err) {
    res.send(400);
  }

  // let foundUserByID = await User.findById(req.params.id);

  // res.send(foundUserByID);
});

/**
 * @route GET /user/:UserId/cart
 * @desc Gets the user’s cart
 */
router.get("/:UserId/cart", async (req, res) => {
  //find the user
  try {
    const user = await userData.findById(req.params.UserId).populate([
      {
        path: "cart",
        model: "Cart",
        populate: {
          path: "cartItems.storeItem",
          model: "StoreItem",
        },
      },
    ]);
    res.send(user.cart)
  } catch (err) {
    res.send(400);
  }
});

/**
 * @route DELETE /user/:UserId/cart
 * @desc Empties the user’s cart
 */
router.delete("/:userId/cart", async (req, res) => {
  let user = await userData.findById(req.params.userId).populate("cart");
  //find the user
  if (!user) {
    return res.send(404);
  }
  //find the users cart
  user.cart.cartItems = [];
  const cart = await user.cart.save();
  //user = await user.save();

  res.send(user.cart);
});

module.exports = router;
