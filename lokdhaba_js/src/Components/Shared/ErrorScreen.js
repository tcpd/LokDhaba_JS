import React, { Component } from 'react';
import '../../Assets/Styles/select.css';

const ErrorScreen = (props) => {
	return (
		<div style={{color: "red", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center"}}>
        	{props.message}
        	<br/>
        	Please refresh the page and try again.
        </div>
	)
}

export default ErrorScreen;
