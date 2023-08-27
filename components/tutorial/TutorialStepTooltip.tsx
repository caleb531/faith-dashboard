'use client';
import Button from '@components/reusable/Button';
import clsx from 'clsx';
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
      className={clsx(
        'tutorial-step-tooltip',
        `position-${calculatedPosition}`,
        `alignment-${currentStep.alignment}`
      )}
      // Because there are several steps which are tied to the same component
      // (namely, WidgetShell), the DOM element for this tooltip gets reused
      // between steps, which means that tab-based keyboard navigation does not
      // get reset between steps; however, from a UX standpoint, it would be
      // nice for tab-navigation to reset for each step, and we can accomplish
      // this behavior by simply keying the DOM element with a unique ID
      // (namely, the ID of the current step)
      key={currentStep.id}
      style={{ width: currentStep.width || 'auto' }}
      ref={messageRef}
    >
      <p className="tutorial-step-tooltip-message">{currentStep.message}</p>
      <div className="tutorial-step-tooltip-controls">
        <Button
          type="submit"
          className="tutorial-step-tooltip-control"
          onClick={moveToNextStep}
        >
          {currentStep.primaryButtonLabel || (isLastStep ? 'Done' : 'Next')}
        </Button>
        {isLastStep === false ? (
          <Button
            className="tutorial-step-tooltip-control warning"
            onClick={skipTutorial}
          >
            Skip Tutorial
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default TutorialStepTooltip;
