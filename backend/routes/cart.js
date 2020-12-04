const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const cartData = require("../models/cartModel");
const storeData = require("../models/storeItemModel")

const cartValidators = [
  body("storeItemId").isString(),
  body("quantity").isNumeric(),
];

/**
 * @route POST /cart/:CartId/cartItem
 * @desc  Add a new item to the cart
 */
router.post("/:cartId/cartItem", cartValidators, async (req, res) => {
  try {
            // This code validates the post body to make sure it has all the minimum pieces we need to create a user
            if (!validationResult(req).isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            // Find the correct cart
            let cart = await cartData.findById(req.params.cartId).populate('cartItems.storeItem');

            // See if we already have same item in cart, if we do, add the quantity
            const cartItemAlreadyInCart = await cart.cartItems.find(cartItem => {
                return cartItem.storeItem.id.toString() == req.body.storeItemId
            });
            if (cartItemAlreadyInCart) {
                cartItemAlreadyInCart.quantity += req.body.quantity;
            }
            //If not, add it to the cart
            else {
                // Create a new cartItem from the body
                let storeItem = await storeData.findById(req.body.storeItemId);
                const newCartItem = {storeItem, quantity: req.body.quantity};
                cart.cartItems.push(newCartItem);
            }

            cart = await cart.save();

            res.send(cart);
        }
        catch(e){
            res.send(e)
        }
    });

/**
 * @route DELETE /cart/:CartId/cartItem/:cartItemId
 * @desc Remove an item from the cart
 */
router.delete("/:cartID/cartItem/:storeItemId", async (req, res) => {
  // Find the correct cart
  console.log('here in delete')
  let cart = await cartData
    .findById(req.params.cartID)
    .populate("cartItems.storeItem");
  if (!cart) {
    console.log('cart not found');
    return res.sendStatus(404);
  }
  //find the correct Item in that cart
  const cartItemInCart = cart.cartItems.find((cartItem) => {
    console.log(cartItem.id)
    console.log(req.params.storeItemId);
    console.log('--')
    return cartItem.id.toString() == req.params.storeItemId;
  });

  // If it isn't found, return from function and send a 404
  if (!cartItemInCart) {
    console.log('item not found')
    return res.sendStatus(404);
  }

  // Else remove it from the array and send it.
  cart.cartItems.pull(cartItemInCart);
  cart = await cart.save();

  res.send(cart);
});

module.exports = router;
