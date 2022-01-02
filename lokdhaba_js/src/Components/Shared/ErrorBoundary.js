import React, { Component } from 'react';

import ErrorScreen from './ErrorScreen.js';

// Component that wraps a returned UI component and presents an error screen if the UI component throws an error
class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ 
      hasError: true 
    });

    // TODO: where to log errors?
    // console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      // return fallback UI
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
