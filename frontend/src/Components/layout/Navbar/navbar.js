import React, { Component, Fragment } from "react";

export default class navbar extends Component {
  render() {
    const notLoggedInNav = () => {
      return (
        <Fragment>
          <li>
            <a className="nav-link" href="/login">
              About
            </a>
          </li>
        </Fragment>
      );
    };

    const loggedInNav = () => {
      const name = localStorage.getItem("userName");
      return (
        <Fragment>
          <li className="nav-item">
            <span className="nav-link">Welcome, {name}!</span>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/"
            onClick={() => {
              window.localStorage.clear();
            }}>
              Logout
            </a>
          </li>
        </Fragment>
      );
    };

    const setNav = () => {
      if (localStorage.getItem("token") == null) {
        return notLoggedInNav();
      } else {
        return loggedInNav();
      }
    };

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary static-top">
          <div className="container">
            <a class="navbar-brand" href="/">
              Namazon
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">{setNav()}</ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
