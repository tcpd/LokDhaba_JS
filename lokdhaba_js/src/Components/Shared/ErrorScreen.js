import React, { Component } from 'react';
import '../../Assets/Styles/select.css';

// Fallback UI component that's displayed instead of a React error
const ErrorScreen = (props) => {
  return (
    <div style={{color: "red", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center"}}>
    	{/* Customizable message that must be passed to the component when calling */}
      {props.message}
      <br/>
      Please refresh the page and try again.
    </div>
  )
}

export default ErrorScreen;
