import React from 'react';
import TutorialMessage from '../tutorial/TutorialMessage';
import useTutorialStep from '../tutorial/useTutorialStep';

function AppCompletedTutorial() {
  const { isCurrentStep } = useTutorialStep('completed');
  return (
    isCurrentStep ? <TutorialMessage /> : null
  );
}

export default AppCompletedTutorial;
