import React, { useMemo, useState } from 'react';
import { GettingStartedContextValue } from './gettingStarted';
import GettingStartedContext from './GettingStartedContext';
import gettingStartedSteps from './gettingStartedSteps';

type Props = { children: JSX.Element | JSX.Element[] };

function GettingStartedFlow({ children }: Props) {

  const [currentStepId, setCurrentStepId] = useState(gettingStartedSteps[0].id);

  // We want to send multiple values (the count and a setter) to the below
  // context; however, if we try to inline an object, the context value will
  // change on every render, causing useless renders for consumers of that
  // context; to fix, we can memoize the object (representing the latest
  // context value) until the current step changes
  const contextValue: GettingStartedContextValue = useMemo(() => {
    return [currentStepId, setCurrentStepId];
  }, [currentStepId]);

  return (
    <GettingStartedContext.Provider value={contextValue}>
      {children}
    </GettingStartedContext.Provider>
  );
}

export default GettingStartedFlow;
