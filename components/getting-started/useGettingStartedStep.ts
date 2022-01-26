import { useContext } from 'react';
import GettingStartedContext from './GettingStartedContext';
import gettingStartedSteps from './gettingStartedSteps';

type ReturnValue = { isCurrentStep: boolean, gettingStartedStepProps: object }

// The useGettingStartedStep() hook exposes data for an arbitrary component to
// be highlighted as a step in the "Getting Started" UX
function useGettingStartedStep(componentStepId: string): ReturnValue {

  const { inProgress, currentStep } = useContext(GettingStartedContext);
  const componentStep = gettingStartedSteps.find((step) => step.id === componentStepId);
  const isCurrentStep = (componentStep === currentStep);

  return inProgress && isCurrentStep ? {
    isCurrentStep,
    gettingStartedStepProps: {
      'data-getting-started-step-active': componentStep.id
    }
  } : { isCurrentStep: false, gettingStartedStepProps: {} };

}

export default useGettingStartedStep;