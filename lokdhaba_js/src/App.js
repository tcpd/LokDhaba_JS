import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import HomePage from './Components/HomePage';
import About from './Components/About';
import NavBar from './Components/NavBar';
import Documentation from './Components/Documentation'
import BrowseData from './Components/BrowseData'
import DataVisualization from './Components/DataVisualization'
import { BrowserRouter as Router, Route } from "react-router-dom"

class App extends Component {
  render() {

    return (
      <div>
        <NavBar />
        <Router>
          <Route path="/" exact component={HomePage} />
          <Route path="/data-vis" exact component={DataVisualization} />
          <Route path="/browse-data" exact component={BrowseData} />
          <Route path="/docs" exact component={Documentation} />
          <Route path="/about" exact component={About} />
        </Router>
      </div>
    )
  }
}
export default App;
