import { useCallback } from 'react';
import { WidgetState } from './widget.d';

// The duration (in ms) of a widget transitioning onto / off of the dashboard
// (i.e as the result of adding or removing a widget); this value MUST match
// the transition duration in _widgets.scss
const widgetTransitionDuration = 350;

// The useWidgetTransitioner() hook transitions a widget element when it's
// added and removed from the dashboard; it accepts callback functions for
// running arbitrary code when a transition completes
function useWidgetTransitioner({
  widget,
  onAddTransitionEnd = () => {/* noop */},
  onRemoveTransitionEnd = () => {/* noop */}
}: {
  widget: WidgetState,
  onAddTransitionEnd?: (widget: WidgetState) => void
  onRemoveTransitionEnd?: (widget: WidgetState) => void
}): {
  handleWidgetTransition: (widgetContentsElement: HTMLElement | null) => void
} {

  // Retrieve the verical space (in pixels) occupied by the widget onscreen
  function getWidgetVerticalSpace(widgetElement: HTMLElement): number {
    return (
      widgetElement.offsetHeight
      +
      parseFloat(window.getComputedStyle(widgetElement)?.marginBottom)
    );
  }

  const transitionWidgetAddition = useCallback((widget: WidgetState, widgetElement: HTMLElement) => {
    const widgetVerticalSpace = getWidgetVerticalSpace(widgetElement);
    widgetElement.style.marginBottom = `-${widgetVerticalSpace}px`;
    setTimeout(() => {
      widgetElement.classList.add('adding-widget');
      setTimeout(() => {
        widgetElement.style.marginBottom = '';
        widgetElement.classList.remove('adding-widget');
        onAddTransitionEnd(widget);
      }, widgetTransitionDuration);
    });
  }, [onAddTransitionEnd]);

  const transitionWidgetRemoval = useCallback((widget: WidgetState, widgetElement: HTMLElement) => {
    const widgetVerticalSpace = getWidgetVerticalSpace(widgetElement);
    widgetElement.style.marginBottom = `-${widgetVerticalSpace}px`;
    widgetElement.classList.add('removing-widget');
    // Wait for the widget to transition out of view before removing the
    // widget from the array (which will cause an immediate re-render)
    setTimeout(() => {
      widgetElement.classList.remove('removing-widget');
      onRemoveTransitionEnd(widget);
    }, widgetTransitionDuration);
  }, [onRemoveTransitionEnd]);

  // Handle widget transitions (such as when adding or removing a widget)
  const handleWidgetTransition = useCallback((widgetContentsElement: HTMLElement | null) => {
    if (!widgetContentsElement) {
      return;
    }
    const widgetElement = widgetContentsElement.parentElement;
    if (!widgetElement) {
      return;
    }
    if (widget.isAdding) {
      // TODO: finish logic to transition widget when adding to dashboard
      transitionWidgetAddition(widget, widgetElement);
    } else if (widget.isRemoving) {
      transitionWidgetRemoval(widget, widgetElement);
    }
  }, [widget, transitionWidgetAddition, transitionWidgetRemoval]);

  return { handleWidgetTransition };

}
export default useWidgetTransitioner;
