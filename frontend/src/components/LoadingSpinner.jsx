import React from 'react';

export function LoadingSpinner({ message = 'Loading records...' }) {
  return (
    <div className="spinner-wrapper" data-testid="loading-spinner">
      <div className="spinner" />
      <span>{message}</span>
    </div>
  );
}

export default LoadingSpinner;
