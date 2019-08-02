import React, { Component } from 'react';
import HomePage from './Components/HomePage';
import About from './Components/About';
import NavBar from './Components/NavBar';
import Documentation from './Components/Documentation'
import BrowseData from './Components/BrowseData'
class App extends Component {
  constructor(props){
        super(props);
        this.displayPage = this.displayPage.bind(this);
        this.state= {activePage: "Home"};
      }

  displayPage(pageName){
    this.setState({activePage: pageName});
  }

  render() {
    var activePage = this.state.activePage;

    return (
        <div>
          <NavBar displayPage={this.displayPage}/>
          { activePage==="Home" && <HomePage />}
          { activePage==="About" && <About />}
          { activePage==="Documentation" && <Documentation />}
          { activePage==="Browse Data" && <BrowseData />}
        </div>
    )
  }
}
export default App;
