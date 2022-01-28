import { debounce } from 'lodash-es';
import { RefObject, useLayoutEffect, useMemo, useState } from 'react';
import useEventListener from '../useEventListener';
import {
  GettingStartedStep,
  GettingStartedStepPosition as Position
} from './gettingStarted.d';

function recalculatePosition(ref: RefObject<HTMLElement>, originalPosition: Position, setPosition: (position: Position) => void) {
  if (ref) {
    const messageBounds = ref.current.getBoundingClientRect();
    const bodyBounds = document.body.getBoundingClientRect();
    const availableSpace = {
      top: messageBounds.top - bodyBounds.top,
      bottom: bodyBounds.bottom - messageBounds.bottom,
      left: messageBounds.left - bodyBounds.left,
      right: bodyBounds.right - messageBounds.right,
      middle: 0
    };
    if (messageBounds.top > bodyBounds.top) {
      setPosition('top');
    } else if (messageBounds.right < bodyBounds.right) {
      setPosition('right');
    } else if (messageBounds.left > bodyBounds.left) {
      setPosition('left');
    } else if (messageBounds.right < bodyBounds.right) {
      setPosition('right');
    }
  }
}

type Params = { isCurrentStep: boolean, currentStep: GettingStartedStep, ref: RefObject<HTMLElement> }

function useGettingStartedStepMessagePositioner({ isCurrentStep, currentStep, ref }: Params): Position {

  const [position, setPosition] = useState<Position>(null);

  const resizeHandler = useMemo(() => {
    return debounce(() => {
      if (isCurrentStep) {
        recalculatePosition(ref, currentStep.position, setPosition);
      }
    }, 100);
  }, [isCurrentStep, currentStep.position, ref]);
  useEventListener(window, 'resize', resizeHandler);

  useLayoutEffect(() => {
    if (isCurrentStep) {
      recalculatePosition(ref, currentStep.position, setPosition);
    }
  }, [isCurrentStep, currentStep, ref]);

  return position;

}

export default useGettingStartedStepMessagePositioner;
