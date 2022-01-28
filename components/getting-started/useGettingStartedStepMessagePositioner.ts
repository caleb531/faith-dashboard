import { debounce } from 'lodash-es';
import { RefObject, useLayoutEffect, useMemo, useState } from 'react';
import useEventListener from '../useEventListener';
import {
  GettingStartedStep,
  GettingStartedStepPosition as Position
} from './gettingStarted.d';

function recalculatePosition(ref: RefObject<HTMLElement>, originalPosition: Position, setPosition: (position: Position) => void) {
  if (!ref.current) {
    return;
  }
  const messageBounds = ref.current.getBoundingClientRect();
  const targetBounds = ref.current.parentElement.getBoundingClientRect();
  const bodyBounds = document.body.getBoundingClientRect();
  if ((targetBounds.left - messageBounds.width) > bodyBounds.left) {
    setPosition('left');
  } else if ((targetBounds.right + messageBounds.width) < bodyBounds.right) {
    setPosition('right');
  } else if ((targetBounds.top - messageBounds.height) > bodyBounds.top) {
    setPosition('top');
  } else if ((targetBounds.bottom + messageBounds.height) < bodyBounds.bottom) {
    setPosition('bottom');
  }
}

type Params = { isCurrentStep: boolean, currentStep: GettingStartedStep, ref: RefObject<HTMLElement> }

function useGettingStartedStepMessagePositioner({ isCurrentStep, currentStep, ref }: Params): Position {

  const [position, setPosition] = useState<Position>(null);
  // Keep track of a dummy state variable so that we can trigger a re-render
  // for every (debounced) resize event
  const [resizeCount, setResizeCount] = useState(0);

  const resizeHandler = useMemo(() => {
    return debounce(() => {
      if (isCurrentStep) {
        setResizeCount((count) => count + 1);
      }
    }, 100);
  }, [isCurrentStep]);
  useEventListener(window, 'resize', resizeHandler);

  useLayoutEffect(() => {
    console.log(isCurrentStep, ref.current);
    if (isCurrentStep && ref.current) {
      recalculatePosition(ref, currentStep.position, setPosition);
    }
  }, [isCurrentStep, currentStep, ref, resizeCount]);

  return position;

}

export default useGettingStartedStepMessagePositioner;
