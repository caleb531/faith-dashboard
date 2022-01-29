import { debounce } from 'lodash-es';
import { RefObject, useLayoutEffect, useMemo, useState } from 'react';
import useEventListener from '../useEventListener';
import {
  TutorialStep,
  TutorialStepPosition as Position
} from './tutorial.d';

function recalculatePosition(ref: RefObject<HTMLElement>, originalPosition: Position, setPosition: (position: Position) => void) {
  if (!ref.current) {
    return;
  }
  if (originalPosition !== 'auto') {
    return;
  }
  const messageBounds = ref.current.getBoundingClientRect();
  const targetBounds = ref.current.parentElement.getBoundingClientRect();
  const bodyBounds = document.body.getBoundingClientRect();
  if ((targetBounds.right + messageBounds.width) < bodyBounds.right) {
    setPosition('right');
  } else if ((targetBounds.left - messageBounds.width) > bodyBounds.left) {
    setPosition('left');
  } else if ((targetBounds.bottom + messageBounds.height) < bodyBounds.bottom) {
    setPosition('bottom');
  } else if ((targetBounds.top - messageBounds.height) > bodyBounds.top) {
    setPosition('top');
  }
}

type Params = { currentStep: TutorialStep, ref: RefObject<HTMLElement> }

function useTutorialStepMessagePositioner({ currentStep, ref }: Params): Position {

  const [position, setPosition] = useState<Position>(null);
  // Keep track of a dummy state variable so that we can trigger a re-render
  // for every (debounced) resize event
  const [resizeCount, setResizeCount] = useState(0);

  const resizeHandler = useMemo(() => {
    return debounce(() => {
      setResizeCount((count) => count + 1);
    }, 100);
  }, []);
  useEventListener(window, 'resize', resizeHandler);

  useLayoutEffect(() => {
    recalculatePosition(ref, currentStep.position, setPosition);
  }, [currentStep, ref, resizeCount]);

  return position;

}

export default useTutorialStepMessagePositioner;
