import React, { Component, createRef } from "react";

const axios = require("axios");

export default class storeItems extends Component {
  handleAddToCart = async (storeItemId) => {
    //Item to send in req.params
    const targetCartId = this.props.cartId;
    //Item to send in body
    const targetStoreItemid = storeItemId;
    //Token for header
    const token = localStorage.getItem("token");

    console.log(targetStoreItemid);

    console.log(targetCartId);

    let body = {
      storeItemId: targetStoreItemid.toString(),
      quantity: 1,
    };

    let res = await axios.post(
      `http://localhost:8080/cart/${targetCartId}/cartItem`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res) {
      this.props.populateCart();
    }
  };
  handleMarkAsViewed = async (storeItemId) => {
    /**
     * Do not have the app working with sessions at the moment
     * What I would have to do is add this to the recentView component
     * Right now the function sends the request to do this.
     *
     */

    let token = localStorage.getItem("token");
    let viewedItem = storeItemId;
    let res = await axios.get(
      `http://localhost:8080/storeItems/${viewedItem}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res) {
      console.log(res);
    }
  };
  sortAZ = () => {
    /**
     * This is how I would sort the items
     * But I would need to set the state here after the sort
     * it sometimes works? but after a while it throws an error
     */
    this.props.storeItems.sort((a, b) => {
      let titleA = a.title.toLowerCase(),
        titleB = b.title.toLowerCase();

      if (titleA < titleB)
        //sort string ascending
        return -1;
      if (titleA > titleB) return 1;
      return 0; //default return value (no sorting)
    });
  };
  sortZA = () => {
    /**
     * This is how I would sort the items
     * But I would need to set the state here after the sort
     * it sometimes works? but after a while.
     */
    console.log(
    this.props.storeItems.sort((a, b) => {
      let titleA = a.title.toLowerCase(),
        titleB = b.title.toLowerCase();

      if (titleB < titleA)
        //sort string ascending
        return -1;
      if (titleB > titleA) return 1;
      return 0; //default return value (no sorting)
    })
    )
  };
  render() {
    return (
      <div>
        <div className="card bg-primary">
          <div className="card-body">
            <div
              class="btn-toolbar"
              role="toolbar"
              aria-label="Toolbar with button groups"
            >
              <div class="btn-group mr-2" role="group" aria-label="First group">
                <button
                  type="button"
                  class="btn btn-secondary"
                  onClick={this.sortAZ}
                >
                  Sort A-Z
                </button>
                <button
                  type="button"
                  class="btn btn-secondary" onClick={this.sortZA}
                >
                  Sort Z-A
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="vh-100 overflow-auto">
          {this.props.storeItems.map((items) => (
            <div className="card mb-3">
              <div className="row no-gutters">
                <div className="col-md-4 p-4">
                  <img src={items.image} className="card-img" alt="..." />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{items.title}</h5>
                    <p className="card-text">{items.description}</p>
                    <p className="card-text">Price: ${items.price}</p>
                    <p className="card-text">
                      Items In Stock: {items.quantity}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="container-fluid">
                  <button
                    className="btn btn-primary btn-lg btn-block"
                    onClick={this.handleAddToCart.bind(this, items._id)}
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg btn-block"
                    onClick={this.handleMarkAsViewed.bind(this, items._id)}
                  >
                    Mark as viewed
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
