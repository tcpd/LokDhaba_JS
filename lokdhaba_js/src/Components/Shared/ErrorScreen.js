import React from 'react';
import '../../Assets/Styles/select.css';

// Fallback UI component that's displayed instead of a React error
const ErrorScreen = (props) => {
  return (
    <div style={{color: "red", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center"}}>
    	{/* Customizable message that must be passed to the component when calling */}
      {props.message}
      <br/>
      Please try a different configuration of options.
    </div>
  )
}

export default ErrorScreen;
