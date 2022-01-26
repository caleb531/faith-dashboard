import gettingStartedSteps from './gettingStartedSteps';

const currentStepId = gettingStartedSteps[0].id;

// The useGettingStartedStep() hook exposes data for an arbitrary component to
// be highlighted as a step in the "Getting Started" UX
function useGettingStartedStep(componentStepId: string) {

  const componentStep = gettingStartedSteps.find((step) => step.id === componentStepId);

  return componentStep?.id === currentStepId ? {
    'data-getting-started-step-active': componentStep
  } : null;

}

export default useGettingStartedStep;
