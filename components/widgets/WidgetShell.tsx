import AppContext from '@components/app/AppContext';
import { DraggableProvided } from '@hello-pangea/dnd';
import classNames from 'classnames';
import React, { Dispatch, useCallback, useContext } from 'react';
import LoadingIndicator from '../reusable/LoadingIndicator';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';
import { WidgetAction } from './useWidgetShell';
import useWidgetTransitioner from './useWidgetTransitioner';
import { WidgetState } from './widget.types';

type Props = {
  widget: WidgetState;
  dispatchToWidget: Dispatch<WidgetAction>;
  provided: DraggableProvided;
  children: React.ReactNode;
};

function WidgetShell({ widget, dispatchToWidget, provided, children }: Props) {
  const { dispatchToApp } = useContext(AppContext);

  const widgetStepData = useTutorialStep(`widget-${widget.tutorialStepId}`);
  const dragStepData = useTutorialStep(`drag-widget-${widget.tutorialStepId}`);
  const removeStepData = useTutorialStep(
    `remove-widget-${widget.tutorialStepId}`
  );
  const settingsStepData = useTutorialStep(
    `configure-widget-${widget.tutorialStepId}`
  );
  const isCurrentStep =
    widgetStepData.isCurrentStep ||
    dragStepData.isCurrentStep ||
    removeStepData.isCurrentStep ||
    settingsStepData.isCurrentStep;

  // Signal to the global application that we want to remove the widget
  function requestRemoveWidget() {
    const confirmation = confirm(
      'Are you sure you want to permanently delete this widget?'
    );
    if (confirmation) {
      dispatchToWidget({ type: 'markWidgetForRemoval' });
    }
  }

  function handleResize(event: React.MouseEvent<HTMLElement>) {
    const newHeight = parseFloat(event.currentTarget.style.height);
    // Only trigger the resizeWidget action when the height actually changes
    // (this is to prevent the action from firing whenever mouseUp is called,
    // which could be all the time)
    if (newHeight && newHeight !== widget.height) {
      dispatchToWidget({ type: 'resizeWidget', payload: newHeight });
    }
  }

  const { handleWidgetTransition } = useWidgetTransitioner({
    widget,
    onAddTransitionEnd: useCallback(
      (widget) => {
        dispatchToWidget({ type: 'markWidgetAsAdded' });
      },
      [dispatchToWidget]
    ),
    onRemoveTransitionEnd: useCallback(
      (widget) => {
        dispatchToApp({ type: 'removeWidget', payload: widget });
      },
      [dispatchToApp]
    )
  });

  return (
    <article
      data-widget-id={widget.id}
      data-widget-type={widget.type}
      className={classNames('widget', `widget-type-${widget.type}`, {
        'widget-settings-open': widget.isSettingsOpen
      })}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...widgetStepData.stepProps}
      {...dragStepData.stepProps}
      {...removeStepData.stepProps}
      {...settingsStepData.stepProps}
    >
      {isCurrentStep ? <TutorialStepTooltip /> : null}
      <div className="widget-controls widget-controls-left">
        <div
          className="widget-drag-handle widget-control"
          {...provided.dragHandleProps}
          {...dragStepData.stepProps}
        >
          <img
            src="/icons/drag-handle-light.svg"
            alt="Drag Widget"
            draggable="false"
            className="widget-drag-handle-icon widget-control-icon"
          />
        </div>
      </div>
      <div className="widget-controls widget-controls-right">
        <button
          type="button"
          className="widget-remove-control widget-control"
          onClick={() => requestRemoveWidget()}
          {...removeStepData.stepProps}
        >
          <img
            src="/icons/remove-circle-light.svg"
            alt="Remove Widget"
            className="widget-remove-control-icon widget-control-icon"
            draggable="false"
          />
        </button>
        <button
          type="button"
          className="widget-settings-toggle widget-control"
          onClick={(event) => dispatchToWidget({ type: 'toggleSettings' })}
          {...settingsStepData.stepProps}
        >
          <img
            src="/icons/settings-light.svg"
            alt="Toggle Settings"
            draggable="false"
            className="widget-settings-toggle-icon widget-control-icon"
          />
        </button>
      </div>
      {widget.isLoading ? (
        <div className="loading-indicator-blocking-container">
          <LoadingIndicator />
        </div>
      ) : (
        <div
          className="widget-contents"
          style={{ height: widget.height }}
          onMouseUp={(event) => handleResize(event)}
          ref={handleWidgetTransition}
        >
          {children}
        </div>
      )}
    </article>
  );
}

export default WidgetShell;
