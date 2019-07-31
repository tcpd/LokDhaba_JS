import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class NavBar extends Component {
  render() {
    return (
       <div className="container-fluid">
        <div className="row">
            <ul className="nav nav-tabs">
              <li className="col-xs-1 active"><Link to="">Home</Link></li>
              <li className="col-xs-2"><Link to="">Data Visualization</Link></li>
              <li className="col-xs-2"><Link to="">Browse Data</Link></li>
              <li className="col-xs-2"><Link to="">Data Download</Link></li>
              <li className="col-xs-2"><Link to="">Documentation</Link></li>
              <li className="col-xs-1"><Link to="">About</Link></li>
              <li className="col-xs-2"><Link to="">Incumbency Profile</Link></li>
            </ul>
        </div>
      </div>
    )
  }
}
export default NavBar;
