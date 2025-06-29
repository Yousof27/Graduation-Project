import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught an Error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with the AR model.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
