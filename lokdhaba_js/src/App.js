import React, { Component } from 'react';
import Routes from "./Routes";
import "./App.css";
import NavBar from './Components/Shared/NavBar.js';
import Footer from './Components/Shared/Footer.js';

class App extends Component {
  render() {

    return (
      <div className="cont">
        <NavBar />
        <Routes />
        <Footer />
      </div>
    )
  }
}
export default App;