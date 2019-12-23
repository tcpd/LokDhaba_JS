import React, { Component } from 'react';

var style = {
  backgroundColor: "#B83027",
  color: "white",
  padding: "10px",
  left: "0",
  bottom: "0",
  height: "min-content",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

var textStyle = {
  display: "inline-block",
  margin: "0 auto"
}
var logoStyle = {
  float: "right"
}

function Footer() {
  return (
      <div>
          <div style={style}>
          <p style={{float: "left", margin: "auto 0"}}>LokDhaba 2.0 beta</p>
          <p style={textStyle} >Ⓒ Trivedi Centre for Political Data, Ashoka University</p>
          <img style={logoStyle} src={require("../../Assets/Images/ashoka_logo.png")} height="100%" width="100px"></img>
          </div>
      </div>
  )
}

export default Footer