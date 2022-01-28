import React from 'react';
import GettingStartedMessage from '../getting-started/GettingStartedMessage';
import useGettingStartedStep from '../getting-started/useGettingStartedStep';

function AppWelcome() {
  const { isCurrentStep } = useGettingStartedStep('welcome');
  return (
    isCurrentStep ? <GettingStartedMessage /> : null
  );
}

export default AppWelcome;
