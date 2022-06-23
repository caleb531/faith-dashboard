import { useContext } from 'react';
import TutorialContext from './TutorialContext';
import tutorialSteps from './tutorialSteps';

type ReturnValue = { isCurrentStep: boolean; stepProps: object };

// The useTutorialStep() hook exposes data for an arbitrary component to
// be highlighted as a step in the "Tutorial" UX
function useTutorialStep(componentStepId: string): ReturnValue {
  const { inProgress, currentStep } = useContext(TutorialContext);
  const componentStep = tutorialSteps.find(
    (step) => step.id === componentStepId
  );
  const isCurrentStep = componentStep === currentStep;

  return inProgress && isCurrentStep
    ? {
        isCurrentStep,
        stepProps: {
          'data-tutorial-step': componentStep.id,
          'data-tutorial-current-step': componentStep.id
        }
      }
    : {
        isCurrentStep: false,
        stepProps: { 'data-tutorial-step': 'true' }
      };
}

export default useTutorialStep;
