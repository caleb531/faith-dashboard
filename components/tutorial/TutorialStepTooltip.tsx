import classNames from 'classnames';
import { useContext, useRef } from 'react';
import useScrollIntoView from '../useScrollIntoView';
import TutorialContext from './TutorialContext';
import tutorialSteps from './tutorialSteps';
import useTutorialStepTooltipPositioner from './useTutorialStepTooltipPositioner';

// When using the <TutorialStepTooltip /> component, the component should be
// wrapped inside of an isCurrentStep check (from the useTutorialStep()
// hook), so that only one instance of TutorialStepTooltip is active at a time
function TutorialStepTooltip() {
  const { currentStep, currentStepIndex, moveToNextStep, skipTutorial } =
    useContext(TutorialContext);
  const messageRef = useRef<HTMLDivElement>(null);
  const isLastStep = currentStepIndex === tutorialSteps.length - 1;

  // Scroll the highlighted element into view when that respective Getting
  // Started step is active
  useScrollIntoView({
    shouldScrollIntoView: true,
    ref: messageRef
  });

  const calculatedPosition =
    useTutorialStepTooltipPositioner({
      currentStep,
      ref: messageRef
    }) || currentStep.position;

  return (
    <div
      className={classNames(
        'tutorial-step-tooltip',
        `position-${calculatedPosition}`,
        `alignment-${currentStep.alignment}`
      )}
      data-testid="tutorial-step-tooltip"
      style={{ width: currentStep.width || 'auto' }}
      ref={messageRef}
    >
      <span className="tutorial-step-tooltip-message">
        {currentStep.message}
      </span>
      <div className="tutorial-step-tooltip-controls">
        <button
          type="submit"
          className="tutorial-step-tooltip-control"
          onClick={moveToNextStep}
        >
          {currentStep.primaryButtonLabel || (isLastStep ? 'Done' : 'Next')}
        </button>
        {isLastStep === false ? (
          <button
            type="button"
            className="tutorial-step-tooltip-control warning"
            onClick={skipTutorial}
          >
            Skip Tutorial
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default TutorialStepTooltip;
