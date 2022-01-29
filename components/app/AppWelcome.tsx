import React from 'react';
import TutorialMessage from '../tutorial/TutorialMessage';
import useTutorialStep from '../tutorial/useTutorialStep';

function AppWelcome() {
  const { isCurrentStep } = useTutorialStep('welcome');
  return (
    isCurrentStep ? <TutorialMessage /> : null
  );
}

export default AppWelcome;
