import React from 'react';
import GettingStartedMessage from '../getting-started/GettingStartedMessage';
import useGettingStartedStep from '../getting-started/useGettingStartedStep';

function AppFinishGettingStarted() {
  const { isCurrentStep } = useGettingStartedStep('completed');
  return (
    isCurrentStep ? <GettingStartedMessage /> : null
  );
}

export default AppFinishGettingStarted;
