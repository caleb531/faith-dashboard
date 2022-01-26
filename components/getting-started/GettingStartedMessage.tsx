import React, { useContext } from 'react';
import GettingStartedContext from './GettingStartedContext';

function GettingStartedMessage() {

  const { currentStep } = useContext(GettingStartedContext);

  return (
    <div className="getting-started-message"></div>
  );
}

export default GettingStartedMessage;
