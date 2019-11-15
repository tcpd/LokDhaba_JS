import React, { Component } from 'react';

var style = {
  backgroundColor: "#B83027",
  color: "white",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "80px",
  width: "100%",
}

var phantom = {
display: 'block',
padding: '20px',
height: '60px',
width: '100%',
}

function Footer() {
  return (
      <div>
          <div style={phantom} />
          <div style={style}>
          <p>Ⓒ Trivedi Centre for Political Data, Ashoka University</p>
          </div>
      </div>
  )
}

export default Footer