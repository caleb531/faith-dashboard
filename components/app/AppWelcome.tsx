import React from 'react';
import TutorialStepMessage from '../tutorial/TutorialStepMessage';
import useTutorialStep from '../tutorial/useTutorialStep';

function AppWelcome() {
  const { isCurrentStep } = useTutorialStep('welcome');
  return (
    isCurrentStep ? <TutorialStepMessage /> : null
  );
}

export default AppWelcome;
