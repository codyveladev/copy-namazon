import React, { Component } from "react";

const axios = require("axios");

export default class cart extends Component {
  handleDeleteFromCart = async (itemId) => {
    let token = localStorage.getItem("token");
    let itemToDelete = itemId;
    let cartId = this.props.cartId;

    console.log(itemToDelete);
    console.log(cartId);

    let res = await axios.delete(
      `http://localhost:8080/cart/${cartId}/cartItem/${itemToDelete}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(res);
    this.props.populateCart();
  };

  render() {
    {
      console.log(this.props.cart);
    }
    if (this.props.cart.length === 0) {
      return (
        <div>
          <div className="card-header bg-primary">
            <h5 className="text-white">Cart</h5>
          </div>
          <div className="vh-100 overflow-auto">
            <div className="card mb-3">
              <div className="row no-gutters">
                <div className="col">
                  <div className="card-body">
                    <h6 className="card-title">Cart empty!</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="card-header bg-primary">
            <h5 className="text-white">Cart</h5>
          </div>
          <div className="vh-100 overflow-auto">
            {/* Populate the cart from the cart prop */}
            {this.props.cart.map((items) => (
              <div className="card mb-3">
                <div className="row no-gutters">
                  <div className="col">
                    <div className="card-body">
                      <h6 className="card-title">{items.storeItem.title}</h6>
                      <p className="card-text">
                        Items In Cart: {items.quantity}
                      </p>
                      <p className="card-text">
                        Total Price: $
                        {(items.storeItem.price * items.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="container-fluid">
                    <button
                      className="btn btn-danger btn-sm btn-block"
                      onClick={this.handleDeleteFromCart.bind(this, items._id)}
                    >
                      Delete From Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}
