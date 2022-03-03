import React, { Component } from 'react';
import ReactDOM from "react-dom";
import "../Assets/Styles/layout.css";

export default class DashPage extends Component {
  render() {
    return (<div className="content-overflow-auto"><iframe frameborder="0"
    marginheight="0"
    marginwidth="0"
    width="100%"
    style ={{height:"800px"}}
    scrolling="auto" src = "https://tcpd.github.io/elecDash/"></iframe> </div> )
  }
}
