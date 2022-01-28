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
  const availableSpace = {
    top: messageBounds.top - bodyBounds.top,
    bottom: bodyBounds.bottom - messageBounds.bottom,
    left: messageBounds.left - bodyBounds.left,
    right: bodyBounds.right - messageBounds.right,
    middle: 0
  };
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

  const resizeHandler = useMemo(() => {
    return debounce(() => {
      if (isCurrentStep && ref.current) {
        recalculatePosition(ref, currentStep.position, setPosition);
      }
    }, 100);
  }, [isCurrentStep, currentStep.position, ref]);
  useEventListener(window, 'resize', resizeHandler);

  useLayoutEffect(() => {
    if (isCurrentStep && ref.current) {
      recalculatePosition(ref, currentStep.position, setPosition);
    }
  }, [isCurrentStep, currentStep, ref]);

  return position;

}

export default useGettingStartedStepMessagePositioner;
