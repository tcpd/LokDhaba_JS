import React, { Component } from 'react';

import ErrorScreen from './ErrorScreen.js';

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ 
      hasError: true 
    });

    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          message="An error occured while trying to get this data."
        />
      );    
    }    
    return this.props.children;
  }
}

export default ErrorBoundary;
