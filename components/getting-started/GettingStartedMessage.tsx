import classNames from 'classnames';
import React, { useContext } from 'react';
import GettingStartedContext from './GettingStartedContext';

type Props = { isCurrentStep: boolean };

function GettingStartedMessage({ isCurrentStep }: Props) {

  const { currentStep, currentStepIndex, moveToNextStep, skipGettingStarted } = useContext(GettingStartedContext);

  return (
    isCurrentStep ? <div className={classNames(
      'getting-started-message',
      `position-${currentStep.position}`,
      `alignment-${currentStep.alignment}`
    )} style={{ width: currentStep.width || 'auto' }}>
      {currentStep.message}
      <div className="getting-started-message-controls">
        <button
          type="button"
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
