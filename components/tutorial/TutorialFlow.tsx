'use client';
import classNames from 'classnames';
import { useCallback, useContext, useState } from 'react';
import AppContext from '../app/AppContext';
import { JSXChildren } from '../global.types';
import useMemoizedContextValue from '../useMemoizedContextValue';
import TutorialContext from './TutorialContext';
import TutorialOverlay from './TutorialOverlay';
import tutorialSteps from './tutorialSteps';

type Props = {
  inProgress: boolean;
  children: JSXChildren;
};

function TutorialFlow({ inProgress, children }: Props) {
  const { dispatchToApp } = useContext(AppContext);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const skipTutorial = useCallback(() => {
    dispatchToApp({ type: 'skipTutorial' });
  }, [dispatchToApp]);

  const moveToNextStep = useCallback(() => {
    if (currentStepIndex + 1 === tutorialSteps.length) {
      // Close Tutorial UI when all steps are completed
      skipTutorial();
    } else {
      // Otherwise, just advance to the next step in the flow
      setCurrentStepIndex((newIndex) => newIndex + 1);
    }
  }, [currentStepIndex, skipTutorial, setCurrentStepIndex]);

  // We want to send multiple values (the count and a setter) to the below
  // context; however, if we try to inline an object, the context value will
  // change on every render, causing useless renders for consumers of that
  // context; to fix, we can memoize the object (representing the latest
  // context value) until the current step changes
  const contextValue = useMemoizedContextValue({
    inProgress,
    currentStepIndex,
    currentStep: tutorialSteps[currentStepIndex],
    moveToNextStep,
    skipTutorial
  });

  return (
    <TutorialContext.Provider value={contextValue}>
      <div
        className={classNames([
          'tutorial-flow-wrapper',
          { 'tutorial-in-progress': inProgress }
        ])}
      >
        <TutorialOverlay isVisible={inProgress} />
        {children}
      </div>
    </TutorialContext.Provider>
  );
}

export default TutorialFlow;
