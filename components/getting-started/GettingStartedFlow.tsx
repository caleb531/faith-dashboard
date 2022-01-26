import React, { useCallback, useContext, useMemo, useState } from 'react';
import AppContext from '../app/AppContext';
import useLocalStorage from '../useLocalStorage';
import { GettingStartedContextValue } from './gettingStarted';
import GettingStartedContext from './GettingStartedContext';
import GettingStartedOverlay from './GettingStartedOverlay';
import gettingStartedSteps from './gettingStartedSteps';

type Props = { shouldShow: boolean, children: JSX.Element | JSX.Element[] };

function GettingStartedFlow({ shouldShow, children }: Props) {

  const dispatchToApp = useContext(AppContext);

  const [restoreHasCompleted, saveHasCompleted] = useLocalStorage(
    'faith-dashboard-widget-getting-started',
    shouldShow || false
  );

  const [inProgress] = useState(() => restoreHasCompleted());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const moveToNextStep = useCallback(() => {
    setCurrentStepIndex((newIndex) => (newIndex + 1) % gettingStartedSteps.length);
  }, [setCurrentStepIndex]);

  // We want to send multiple values (the count and a setter) to the below
  // context; however, if we try to inline an object, the context value will
  // change on every render, causing useless renders for consumers of that
  // context; to fix, we can memoize the object (representing the latest
  // context value) until the current step changes
  const contextValue: GettingStartedContextValue = useMemo(() => {
    return { inProgress, currentStepIndex, moveToNextStep };
  }, [inProgress, currentStepIndex, moveToNextStep]);

  return (
    <GettingStartedContext.Provider value={contextValue}>
      <GettingStartedOverlay isVisible={inProgress} />
      {children}
    </GettingStartedContext.Provider>
  );
}

export default GettingStartedFlow;
