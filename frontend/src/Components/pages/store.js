import React, { Component } from "react";

import Navbar from "../layout/Navbar/navbar";
import StoreItems from "../layout/Store/storeItems";
import Cart from "../layout/Cart/cart";

const axios = require("axios");

export default class store extends Component {
  state = {
    cartId: '',
    cart: [],
    storeItems: [],
  };

  async componentDidMount() {
    this.populateStore();
    this.populateCart();
  }

  populateStore = async () => {
    const token = localStorage.getItem("token");
    await axios
      .get("http://localhost:8080/storeItems/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        this.setState({ storeItems: res.data });
      });
  };

  populateCart = async () => {
    let token = localStorage.getItem("token");
    let userID = localStorage.getItem("userID");
    await axios
      .get(`http://localhost:8080/users/${userID}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);

        this.setState({ cart: res.data.cartItems })
        this.setState({ cartId: res.data._id});
      });
  };


  render() {

    return (
      <div>
        <Navbar />
        <React.StrictMode>
          <div className="container pt-1">
            <div className="row">
              <div className="col-sm"><h1>Recently Viewed</h1></div>
              <div className="col-6">
                <StoreItems
                  storeItems={this.state.storeItems}
                  cart={this.state.cart}
                  cartId={this.state.cartId}
                  populateCart={this.populateCart}
                />
              </div>
              <div className="col-sm">
                <Cart
                  cart={this.state.cart}
                  cartId={this.state.cartId}
                  populateCart={this.populateCart}
                />
              </div>
            </div>
          </div>
        </React.StrictMode>
      </div>
    );
  }
}
