import { useCallback } from 'react';
import useTimeout from '../useTimeout';
import { WidgetState } from './widget.d';

// The duration (in ms) of a widget transitioning onto / off of the dashboard
// (i.e as the result of adding or removing a widget); this value MUST match
// the transition duration in _widgets.scss
const widgetTransitionDuration = 250;

// The useWidgetTransitioner() hook transitions a widget element when it's
// added and removed from the dashboard; it accepts callback functions for
// running arbitrary code when a transition completes
function useWidgetTransitioner({
  widget,
  onAddTransitionEnd = () => {
    /* noop */
  },
  onRemoveTransitionEnd = () => {
    /* noop */
  }
}: {
  widget: WidgetState;
  onAddTransitionEnd?: (widget: WidgetState) => void;
  onRemoveTransitionEnd?: (widget: WidgetState) => void;
}): {
  handleWidgetTransition: (widgetContentsElement: HTMLElement | null) => void;
} {
  const setWidgetAdditionTimeout = useTimeout();
  const setWidgetRemovalTimeout = useTimeout();

  // Retrieve the verical space (in pixels) occupied by the widget onscreen
  function getWidgetVerticalSpace(widgetElement: HTMLElement): number {
    return (
      widgetElement.offsetHeight +
      parseFloat(window.getComputedStyle(widgetElement)?.marginBottom)
    );
  }

  const transitionWidgetAddition = useCallback(
    (widget: WidgetState, widgetElement: HTMLElement) => {
      const widgetVerticalSpace = getWidgetVerticalSpace(widgetElement);
      widgetElement.style.opacity = '0';
      widgetElement.style.marginBottom = `-${widgetVerticalSpace}px`;
      setWidgetAdditionTimeout(() => {
        widgetElement.classList.add('adding-widget');
        setWidgetAdditionTimeout(() => {
          widgetElement.style.opacity = '';
          widgetElement.style.marginBottom = '';
          widgetElement.classList.remove('adding-widget');
          onAddTransitionEnd(widget);
        }, widgetTransitionDuration);
      });
    },
    [onAddTransitionEnd, setWidgetAdditionTimeout]
  );

  const transitionWidgetRemoval = useCallback(
    (widget: WidgetState, widgetElement: HTMLElement) => {
      const widgetVerticalSpace = getWidgetVerticalSpace(widgetElement);
      widgetElement.style.marginBottom = `-${widgetVerticalSpace}px`;
      widgetElement.classList.add('removing-widget');
      // Wait for the widget to transition out of view before removing the
      // widget from the array (which will cause an immediate re-render)
      setWidgetRemovalTimeout(() => {
        widgetElement.classList.remove('removing-widget');
        onRemoveTransitionEnd(widget);
      }, widgetTransitionDuration);
    },
    [onRemoveTransitionEnd, setWidgetRemovalTimeout]
  );

  // Handle widget transitions (such as when adding or removing a widget)
  const handleWidgetTransition = useCallback(
    (widgetContentsElement: HTMLElement | null) => {
      if (!widgetContentsElement) {
        return;
      }
      const widgetElement = widgetContentsElement.parentElement;
      if (!widgetElement) {
        return;
      }
      if (widget.isAdding) {
        transitionWidgetAddition(widget, widgetElement);
      }
      if (widget.isRemoving) {
        transitionWidgetRemoval(widget, widgetElement);
      }
    },
    [widget, transitionWidgetAddition, transitionWidgetRemoval]
  );

  return { handleWidgetTransition };
}
export default useWidgetTransitioner;
