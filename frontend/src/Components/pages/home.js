import React, { Component } from 'react'
import Navbar from '../layout/Navbar/navbar'
import Login from './login'


export default class home extends Component {
    render() {
        return (
          <div className="bg-white vh-100">
            <Navbar />
            <div className="py-5">
              <Login />
            </div>
          </div>
        );
    }
}
