import React from 'react';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';

function AppWelcome() {
  const { isCurrentStep } = useTutorialStep('welcome');
  return (
    isCurrentStep ? <TutorialStepTooltip /> : null
  );
}

export default AppWelcome;
