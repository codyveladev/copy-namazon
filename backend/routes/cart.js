const express = require("express");
const router = express.Router();

import { storeItem } from "../models/storeItemModel";
import { Cart } from "../models/cartModel";
// import { User } from "../models/userModel"

router.get("/test", (req, res) => res.json({ msg: "Cart Works" }));

/**
 * @route POST /cart/:CartId/cartItem
 * @desc  Add a new item to the cart
 */
router.post("/:cartID/cartItem/:storeItemID", async (req, res) => {
  let selectedStoreItem = await storeItem.findById(req.params.storeItemID);
  let targetCart = await Cart.findById(req.params.cartID);

  targetCart.items.push(selectedStoreItem);

  targetCart.save();

  res.send(targetCart);
});

/**
 * @route DELETE /cart/:CartId/cartItem/:cartItemId
 * @desc Remove an item from the cart
 */
router.delete("/:cartID/cartItem/:storeItemId", async (req, res) => {
  let targetCart = await Cart.findById(req.params.cartID);

  targetCart.items.pull(req.params.storeItemId);
  targetCart.save();

  res.send(targetCart);
});

module.exports = router;
