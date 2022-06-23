import React from 'react';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';

function AppCompletedTutorial() {
  const { isCurrentStep } = useTutorialStep('completed');
  return isCurrentStep ? <TutorialStepTooltip /> : null;
}

export default AppCompletedTutorial;
