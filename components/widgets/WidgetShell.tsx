import AppContext from '@components/app/AppContext';
import Button from '@components/reusable/Button';
import Icon from '@components/reusable/Icon';
import { DraggableProvided } from '@hello-pangea/dnd';
import clsx from 'clsx';
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
      className={clsx('widget', `widget-type-${widget.type}`, {
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
          <Icon name="drag-handle-light" alt="Drag Widget" />
        </div>
      </div>
      <div className="widget-controls widget-controls-right">
        <Button
          className="widget-remove-control widget-control"
          onClick={() => requestRemoveWidget()}
          {...removeStepData.stepProps}
        >
          <Icon name="remove-circle-light" alt="Remove Widget" />
        </Button>
        <Button
          className="widget-settings-toggle widget-control"
          onClick={(event) => dispatchToWidget({ type: 'toggleSettings' })}
          {...settingsStepData.stepProps}
        >
          <Icon name="settings-light" alt="Toggle Settings" />
        </Button>
      </div>
      {widget.isLoading ? (
        <LoadingIndicator className="widget-loading-indicator" />
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
