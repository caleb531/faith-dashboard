import classNames from 'classnames';
import React, { useContext, useRef } from 'react';
import useScrollIntoView from '../useScrollIntoView';
import GettingStartedContext from './GettingStartedContext';

type Props = { isCurrentStep: boolean };

function GettingStartedMessage({ isCurrentStep }: Props) {

  const { currentStep, currentStepIndex, moveToNextStep, skipGettingStarted } = useContext(GettingStartedContext);
  const messageRef = useRef<HTMLDivElement>(null);

  // Scroll the highlighted element into view when that respective Getting
  // Started step is active
  useScrollIntoView({
    shouldScrollIntoView: isCurrentStep,
    ref: messageRef
  });

  return (
    isCurrentStep ? <div
        className={classNames(
        'getting-started-message',
        `position-${currentStep.position}`,
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
          {currentStep.primaryButtonLabel || 'Next'}
        </button>
        <button
          type="button"
          className="getting-started-message-control warning"
          onClick={skipGettingStarted}>
          Skip Tutorial
        </button>
      </div>
    </div> : null
  );
}

export default GettingStartedMessage;
