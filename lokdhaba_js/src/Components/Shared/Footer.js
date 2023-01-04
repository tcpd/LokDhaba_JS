import React, { Component } from 'react';

var style = {
  backgroundColor: "#0D3862",
  color: "white",
  padding: "10px",
  left: "0",
  bottom: "0",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

function Footer() {
  return (
      <div>
          <div class="ld_footer row" style={style}>
          <div id="ashoka_logo" class="col"><img src={require("../../Assets/Images/ashoka_logo.png")} height="auto" width="240px"></img></div>
          </div>
      </div>
  )
}

export default Footer