import React, { Component } from "react";

import axios from "axios";
import { Redirect } from "react-router-dom";

export default class login extends Component {
  state = {};

  handleSubmit = (e) => {
    e.preventDefault();

    const userInfo = {
      email: this.email,
      password: this.password,
    };

    axios
      .post("http://localhost:8080/login", userInfo)
      .then((res) => {
        console.log(res);
        let idOfUser = res.data.user._id;
        console.log(idOfUser);
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("userName", res.data.user.firstName);
        localStorage.setItem("userID", res.data.user._id);
        this.setState({
          loggedIn: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    if (this.state.loggedIn) {
      return <Redirect to={"/store"}></Redirect>;
    }
    return (
      <div>
        <div className="container bg-white border-0 pt-2 w-75 ">
          <form onSubmit={this.handleSubmit}>
            <div className="container border-rounded card w-50 p-5">
              <div className="card-header bg-white border-0">
                <h1 className="text-center card-title">Log-In</h1>
              </div>
              <div className="form-group col align-self-center">
                <label className="lead font-weight-bold">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email..."
                  required
                  onChange={(e) => (this.email = e.target.value)}
                />
              </div>

              <div className="form-group pb-3 col align-self-center">
                <label className="lead font-weight-bold">Password</label>
                <input
                  type="password"
                  className="form-control col align-self-center"
                  placeholder="Enter password..."
                  required
                  onChange={(e) => (this.password = e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-info align-self-center btn-block"
              >
                Log-In
              </button>
              <p className="text-center py-3">
                Dont have an account? <a href="/">Register here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
