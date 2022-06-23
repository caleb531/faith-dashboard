import { debounce } from 'lodash-es';
import { RefObject, useLayoutEffect, useMemo, useState } from 'react';
import useEventListener from '../useEventListener';
import { TutorialStep, TutorialStepPosition as Position } from './tutorial.d';

// If the position of a tutorial step is set to 'auto', then this module will
// do its best to position the message by enumerating the following array until
// a message position is found that does not result in it being obscured by the
// viewport; this array can be overridden on any message step object
const defaultPositionPrecedence: Position[] = [
  'right',
  'left',
  'bottom',
  'top'
];

// Return a boolean indicating whether or not there is enough space onscreen ig
// the message were placed on a particular side of the message element
function isSpaceAvailableForPosition(
  messageBounds: DOMRect,
  targetBounds: DOMRect,
  bodyBounds: DOMRect,
  position: Position
) {
  const formulas = {
    right: targetBounds.right + messageBounds.width < bodyBounds.right,
    left: targetBounds.left - messageBounds.width > bodyBounds.left,
    bottom: targetBounds.bottom + messageBounds.height < bodyBounds.bottom,
    top: targetBounds.top - messageBounds.height > bodyBounds.top,
    center: true,
    auto: true
  };
  return formulas[position];
}

function recalculatePosition(
  ref: RefObject<HTMLElement>,
  currentStep: TutorialStep,
  setPosition: (position: Position) => void
) {
  if (!ref.current) {
    return;
  }
  if (!ref.current.parentElement) {
    return;
  }
  if (currentStep.position !== 'auto') {
    return;
  }
  const messageBounds = ref.current.getBoundingClientRect();
  const targetBounds = ref.current.parentElement.getBoundingClientRect();
  const bodyBounds = document.body.getBoundingClientRect();

  const positionPrecedence =
    currentStep.positionPrecedence || defaultPositionPrecedence;
  const calculatedPosition =
    positionPrecedence.find((position) => {
      return isSpaceAvailableForPosition(
        messageBounds,
        targetBounds,
        bodyBounds,
        position
      );
    }) || 'center';
  setPosition(calculatedPosition);
}

type Params = { currentStep: TutorialStep; ref: RefObject<HTMLElement> };

function useTutorialStepTooltipPositioner({
  currentStep,
  ref
}: Params): Position | undefined {
  const [position, setPosition] = useState<Position>();
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
    recalculatePosition(ref, currentStep, setPosition);
  }, [currentStep, ref, resizeCount]);

  return position;
}

export default useTutorialStepTooltipPositioner;
