import { useContext } from 'react';
import GettingStartedContext from './GettingStartedContext';
import gettingStartedSteps from './gettingStartedSteps';

// The useGettingStartedStep() hook exposes data for an arbitrary component to
// be highlighted as a step in the "Getting Started" UX
function useGettingStartedStep(componentStepId: string): object {

  const { inProgress, currentStepIndex } = useContext(GettingStartedContext);
  const componentStepIndex = gettingStartedSteps.findIndex((step) => step.id === componentStepId);
  const componentStep = gettingStartedSteps[componentStepIndex];

  return inProgress && componentStepIndex === currentStepIndex ? {
    'data-getting-started-step-active': componentStep.id
  } : null;

}

export default useGettingStartedStep;
