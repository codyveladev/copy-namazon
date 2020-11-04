const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//Load user model
import { User } from "../models/userModel";
import { Cart } from "../models/cartModel";

const JWT = require("jsonwebtoken");
const accessTokenSecret = "secretToken";

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
  let foundUserByID = await User.findById(req.params.id);

  res.send(foundUserByID);
});

/**
 * @route POST routes/users/register
 * @desc register a new user
 */
router.post("/register", async (req, res) => {
  //Find a users email.
  User.findOne({ email: req.body.email })
    //if a user is found
    .then((user) => {
      if (user) {
        //Send an error
        return res.status(400).json({ msg: "Email already in use!" });
      }
      //Else register the new user
      else {
        const newUser = new User(req.body);

        //assign the user a cart on registration
        newUser.cart = createCart(newUser._id);

        //Save the user to the DB
        newUser
          .save()
          .then((user) => res.json(user))
          .catch((err) => console.log(err));
      }
    });
});
/**
 * @route POST /login
 * @desc verifies the login info and returns a signed JWT token
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({
    email: email,
  });

  if (foundUser === null) {
    res.send(`User not found!`);
  } else {
    if (foundUser.password !== password) {
      res.send(`Password was incorrect!`);
    } else {
      const accessToken = JWT.sign({ user: foundUser }, accessTokenSecret);
      res.send(accessToken);
    }
  }
});

/**
 * @route GET /user/:UserId/cart
 * @desc Gets the user’s cart
 */
router.get("/:userId/cart", async (req, res) => {
  let foundUser = await User.findById(req.params.userId);

  let result = await Cart.find({ _id: foundUser.cart }).populate({
    path: "items", // populate blogs
    populate: {
      path: "storeItems", // in blogs, populate comments
    },
  });

  res.json(result);
});

/**
 * @route DELETE /user/:UserId/cart
 * @desc Empties the user’s cart
 */
router.delete("/:userID/cart", async (req, res) => {
  let foundUser = await User.findById(req.params.userID);

  await Cart.updateOne({ _id: foundUser.cart }, { $set: { items: [] } });

  let updatedCart = await Cart.findById(foundUser.cart);

  res.json(updatedCart);
});

//helper function
const createCart = function (CartUser) {
  const cart = new Cart({
    CartUser,
  });
  cart.save();
  return cart;
};

module.exports = router;
