import { debounce, maxBy } from 'lodash-es';
import { RefObject, useLayoutEffect, useMemo, useState } from 'react';
import useEventListener from '../useEventListener';
import {
  GettingStartedStep,
  GettingStartedStepPosition as Position
} from './gettingStarted.d';

function recalculatePosition(ref: RefObject<HTMLElement>, currentPosition: Position, setPosition: (position: Position) => void) {
  if (ref) {
    const messageBounds = ref.current.parentElement.getBoundingClientRect();
    const bodyBounds = document.body.getBoundingClientRect();
    const availableSpace = {
      top: messageBounds.top - bodyBounds.top,
      bottom: bodyBounds.bottom - messageBounds.bottom,
      left: messageBounds.left - bodyBounds.left,
      right: bodyBounds.right - messageBounds.right,
      middle: 0
    };
    console.log('body', bodyBounds.width);
    console.log('space', availableSpace);
    // If the current message position already has enough space, keep it as-is
    if (currentPosition === 'right' && availableSpace.right < bodyBounds.width) {
      console.log('keep');
      return;
    }
    const mostAvailablePositionName: Position = maxBy(
      Object.keys(availableSpace) as Position[],
      (positionName: Position) => availableSpace[positionName]
    );
    setPosition(mostAvailablePositionName);
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
