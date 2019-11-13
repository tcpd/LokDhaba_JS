import React, { Component } from 'react';
import '../Assets/Styles/navbar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js'
import $ from 'jquery';

export default class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md bg-light" role="navigation">
        <a className="navbar-brand"><img height="100%" width="80px" src={require("../Assets/Images/logo.png")} /></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/data-vis">Data Visualization</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/browse-data">Browse Data</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/docs">Documentation</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Incumbency Profile</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">About</a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}