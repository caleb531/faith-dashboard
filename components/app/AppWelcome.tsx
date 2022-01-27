import React from 'react';
import GettingStartedMessage from '../getting-started/GettingStartedMessage';
import useGettingStartedStep from '../getting-started/useGettingStartedStep';

function AppWelcome() {
  const { isCurrentStep } = useGettingStartedStep('welcome');
  return (
    <GettingStartedMessage isCurrentStep={isCurrentStep} />
  );
}

export default AppWelcome;
