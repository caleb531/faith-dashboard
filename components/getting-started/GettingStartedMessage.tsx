import classNames from 'classnames';
import React, { useContext, useRef } from 'react';
import useScrollIntoView from '../useScrollIntoView';
import GettingStartedContext from './GettingStartedContext';
import gettingStartedSteps from './gettingStartedSteps';
import useGettingStartedStepMessagePositioner from './useGettingStartedStepMessagePositioner';

// When using the <GettingStartedMessage /> component, the component should be
// wrapped inside of an isCurrentStep check (from the useGettingStartedStep()
// hook), so that only one instance of GettingStartedMessage is active at a time
function GettingStartedMessage() {

  const { currentStep, currentStepIndex, moveToNextStep, skipGettingStarted } = useContext(GettingStartedContext);
  const messageRef = useRef<HTMLDivElement>(null);
  const isLastStep = (currentStepIndex === (gettingStartedSteps.length - 1));

  // Scroll the highlighted element into view when that respective Getting
  // Started step is active
  useScrollIntoView({
    shouldScrollIntoView: true,
    ref: messageRef
  });

  const calculatedPosition = useGettingStartedStepMessagePositioner({
    currentStep,
    ref: messageRef
  }) || currentStep.position;

  return (
    <div
        className={classNames(
        'getting-started-message',
        `position-${calculatedPosition}`,
        `alignment-${currentStep.alignment}`
      )}
      style={{ width: currentStep.width || 'auto' }}
      ref={messageRef}>
      <span className="getting-started-message-text">{currentStep.message}</span>
      <div className="getting-started-message-controls">
        <button
          type="submit"
          className="getting-started-message-control"
          onClick={moveToNextStep}>
          {
            currentStep.primaryButtonLabel ||
            (isLastStep ? 'Done' : 'Next')
          }
        </button>
        {isLastStep === false ? <button
          type="button"
          className="getting-started-message-control warning"
          onClick={skipGettingStarted}>
          Skip Tutorial
        </button> : null}
      </div>
    </div>
  );
}

export default GettingStartedMessage;
