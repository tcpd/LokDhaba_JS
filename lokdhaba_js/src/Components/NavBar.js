import React, { Component } from 'react';
import '../Assets/Styles/navbar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

export default class NavBar extends Component {
  constructor(props){
        super(props);
        this.activateLink = this.activateLink.bind(this);
      }

activateLink(e){
   var activeItem = $("li.nav-item.active");
   activeItem.removeClass("active");
   $(e.target).parent().addClass("active");
   this.props.displayPage(e.target.innerText);
}

  render() {
    return (
      <nav className="navbar navbar-expand-sm bg-light" role="navigation">
        <div className="navbar-header">
          <a className="navbar-brand"><img height="100%" width="auto" src={require("../Assets/Images/logo.png")}/></a>
        </div>
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" onClick={this.activateLink}>Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.activateLink}>Data Visualization</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.activateLink}>Browse Data</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.activateLink}>Documentation</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.activateLink}>About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Incumbency Profile</a>
          </li>
        </ul>
      </nav>
    )
  }
}
