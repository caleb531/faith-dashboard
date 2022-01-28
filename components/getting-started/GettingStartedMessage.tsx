import classNames from 'classnames';
import React, { useContext, useRef } from 'react';
import useScrollIntoView from '../useScrollIntoView';
import GettingStartedContext from './GettingStartedContext';
import gettingStartedSteps from './gettingStartedSteps';
import useGettingStartedStepMessagePositioner from './useGettingStartedStepMessagePositioner';

type Props = { isCurrentStep: boolean };

function GettingStartedMessage({ isCurrentStep }: Props) {

  const { currentStep, currentStepIndex, moveToNextStep, skipGettingStarted } = useContext(GettingStartedContext);
  const messageRef = useRef<HTMLDivElement>(null);
  const isLastStep = (currentStepIndex === (gettingStartedSteps.length - 1));

  // Scroll the highlighted element into view when that respective Getting
  // Started step is active
  useScrollIntoView({
    shouldScrollIntoView: isCurrentStep,
    ref: messageRef
  });

  const calculatedPosition = useGettingStartedStepMessagePositioner({
    isCurrentStep,
    currentStep,
    ref: messageRef
  }) || currentStep.position;

  return (
    isCurrentStep ? <div
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
    </div> : null
  );
}

export default GettingStartedMessage;
