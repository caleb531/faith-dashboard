import classNames from 'classnames';
import React, { useContext, useRef } from 'react';
import useScrollIntoView from '../useScrollIntoView';
import TutorialContext from './TutorialContext';
import tutorialSteps from './tutorialSteps';
import useTutorialStepMessagePositioner from './useTutorialStepMessagePositioner';

// When using the <TutorialMessage /> component, the component should be
// wrapped inside of an isCurrentStep check (from the useTutorialStep()
// hook), so that only one instance of TutorialMessage is active at a time
function TutorialMessage() {

  const { currentStep, currentStepIndex, moveToNextStep, skipTutorial } = useContext(TutorialContext);
  const messageRef = useRef<HTMLDivElement>(null);
  const isLastStep = (currentStepIndex === (tutorialSteps.length - 1));

  // Scroll the highlighted element into view when that respective Getting
  // Started step is active
  useScrollIntoView({
    shouldScrollIntoView: true,
    ref: messageRef
  });

  const calculatedPosition = useTutorialStepMessagePositioner({
    currentStep,
    ref: messageRef
  }) || currentStep.position;

  return (
    <div
        className={classNames(
        'tutorial-message',
        `position-${calculatedPosition}`,
        `alignment-${currentStep.alignment}`
      )}
      style={{ width: currentStep.width || 'auto' }}
      ref={messageRef}>
      <span className="tutorial-message-text">{currentStep.message}</span>
      <div className="tutorial-message-controls">
        <button
          type="submit"
          className="tutorial-message-control"
          onClick={moveToNextStep}>
          {
            currentStep.primaryButtonLabel ||
            (isLastStep ? 'Done' : 'Next')
          }
        </button>
        {isLastStep === false ? <button
          type="button"
          className="tutorial-message-control warning"
          onClick={skipTutorial}>
          Skip Tutorial
        </button> : null}
      </div>
    </div>
  );
}

export default TutorialMessage;
