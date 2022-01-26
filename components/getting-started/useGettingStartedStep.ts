import { useContext } from 'react';
import GettingStartedContext from './GettingStartedContext';
import gettingStartedSteps from './gettingStartedSteps';

// The useGettingStartedStep() hook exposes data for an arbitrary component to
// be highlighted as a step in the "Getting Started" UX
function useGettingStartedStep(componentStepId: string): object {

  const { inProgress, currentStep } = useContext(GettingStartedContext);
  const componentStep = gettingStartedSteps.find((step) => step.id === componentStepId);

  return inProgress && componentStep === currentStep ? {
    'data-getting-started-step-active': componentStep.id
  } : null;

}

export default useGettingStartedStep;
