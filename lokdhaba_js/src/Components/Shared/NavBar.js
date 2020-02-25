import React, { Component } from 'react';
import '../../Assets/Styles/navbar.css'
import $ from 'jquery';

export default class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md" role="navigation">
        <a className="navbar-brand" href="/"><img height="100%" width="40px" src={require("../../Assets/Images/logo.png")} /></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent">
          <span style={{fontSize: "26px"}}>
          &#9776;
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/data-vis">Data Visualization</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/browse-data">Browse/Download Data</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://lokdhaba.ashoka.edu.in/incumbency/DL.html">Incumbency Profile</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/docs">Documentation</a>
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
