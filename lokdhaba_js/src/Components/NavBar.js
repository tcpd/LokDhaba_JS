import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export default class NavBar extends Component {
  constructor(props){
        super(props);
        this.showHomePage = this.showHomePage.bind(this);
      }

  showHomePage(){

  }

  render() {
    return (
      <nav class="navbar navbar-expand-sm bg-light">
      //<a class="navbar-brand"><img height="100%" width="auto" src="./Assets/logo.png"></a>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#" onClick={this.showHomePage()}>Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Data Visualization</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Browse Data</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Data Download</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Documentation</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Incumbency Profile</a>
          </li>
        </ul>
      </nav>
    )
  }
}
