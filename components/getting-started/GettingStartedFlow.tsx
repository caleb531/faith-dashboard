import React, { useCallback, useContext, useMemo, useState } from 'react';
import AppContext from '../app/AppContext';
import { GettingStartedContextValue } from './gettingStarted';
import GettingStartedContext from './GettingStartedContext';
import GettingStartedOverlay from './GettingStartedOverlay';
import gettingStartedSteps from './gettingStartedSteps';

type Props = { shouldShow: boolean, children: JSX.Element | JSX.Element[] };

function GettingStartedFlow({ shouldShow, children }: Props) {

  const dispatchToApp = useContext(AppContext);

  const [inProgress, setInProgress] = useState(shouldShow);
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  const skipGettingStarted = useCallback(() => {
    setInProgress(false);
    dispatchToApp({ type: 'skipGettingStarted' });
  }, [setInProgress, dispatchToApp]);

  const moveToNextStep = useCallback(() => {
    if ((currentStepIndex + 1) === gettingStartedSteps.length) {
      // Close Getting Started UI when all steps are completed
      skipGettingStarted();
    } else {
      // Otherwise, just advance to the next step in the flow
      setCurrentStepIndex((newIndex) => (newIndex + 1));
    }
  }, [currentStepIndex, skipGettingStarted, setCurrentStepIndex]);

  // We want to send multiple values (the count and a setter) to the below
  // context; however, if we try to inline an object, the context value will
  // change on every render, causing useless renders for consumers of that
  // context; to fix, we can memoize the object (representing the latest
  // context value) until the current step changes
  const contextValue: GettingStartedContextValue = useMemo(() => {
    return {
      inProgress,
      currentStepIndex,
      currentStep: gettingStartedSteps[currentStepIndex],
      moveToNextStep,
      skipGettingStarted
    };
  }, [inProgress, currentStepIndex, moveToNextStep, skipGettingStarted]);

  return (
    <GettingStartedContext.Provider value={contextValue}>
      <GettingStartedOverlay isVisible={inProgress} />
      {children}
    </GettingStartedContext.Provider>
  );
}

export default GettingStartedFlow;
