import React from 'react';
import TutorialStepMessage from '../tutorial/TutorialStepMessage';
import useTutorialStep from '../tutorial/useTutorialStep';

function AppCompletedTutorial() {
  const { isCurrentStep } = useTutorialStep('completed');
  return (
    isCurrentStep ? <TutorialStepMessage /> : null
  );
}

export default AppCompletedTutorial;
