import React from 'react';

function LoadingIndicator() {

  return (
    <div className="loading-indicator">
      <svg viewBox="0 0 32 32" className="loading-indicator-icon">
        <path d="M 16,2 A 8,8 0,0,1 16,30" />
      </svg>
    </div>
  );

}

export default LoadingIndicator;
