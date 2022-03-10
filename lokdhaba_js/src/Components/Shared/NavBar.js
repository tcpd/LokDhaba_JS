import React, { Component } from 'react';
import SearchBox from '../../Components/Shared/SearchBox';
import '../../Assets/Styles/navbar.css'
import $ from 'jquery';

export default class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md" role="navigation">
        <a className="navbar-brand" href="/"><img height="100%" width="40px" src={require("../../Assets/Images/logo.png")} /></a>
        <div>
          <SearchBox/>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent">
          <span style={{fontSize: "26px"}}>
          &#9776;
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/dash">2022 AE: An Overview</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/data-vis?et=GE">Data Visualization</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/browse-data?et=GE">Browse/Download Data</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://lokdhaba.ashoka.edu.in/pct/home.html">Political Career Tracker</a>
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
