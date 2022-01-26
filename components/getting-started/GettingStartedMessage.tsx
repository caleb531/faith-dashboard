import React, { useContext } from 'react';
import GettingStartedContext from './GettingStartedContext';

type Props = { isCurrentStep: boolean };

function GettingStartedMessage({ isCurrentStep }: Props) {

  const { currentStep, currentStepIndex, moveToNextStep } = useContext(GettingStartedContext);

  return (
    isCurrentStep ? <div className="getting-started-message">
      {currentStep.message}
      <div className="getting-started-message-controls">
        <button
          className="getting-started-message-control"
          onClick={moveToNextStep}>
          {currentStepIndex === 0 ? 'Start' : 'Next'}
        </button>
        <button className="getting-started-message-control">Skip Tutorial</button>
      </div>
    </div> : null
  );
}

export default GettingStartedMessage;
