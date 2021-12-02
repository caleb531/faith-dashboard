import React, { useReducer, useContext } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { AppContext } from '../app/AppContext';
import { WidgetState, StateAction } from '../types';
import widgetTypeMap from './widgetTypeMap';
import LoadingIndicator from '../generic/LoadingIndicator';
import { useWidgetUpdater } from '../hooks';

export function useWidgetShell(subReducer: Function, widget: WidgetState): [WidgetState, Function] {

  function reducer(state: WidgetState, action: StateAction): WidgetState {
    switch (action.type) {
      case 'toggleSettings':
        return { ...state, isSettingsOpen: !state.isSettingsOpen };
      case 'openSettings':
        return { ...state, isSettingsOpen: true };
      case 'closeSettings':
        return { ...state, isSettingsOpen: false };
      case 'resizeWidget':
        return { ...state, height: action.payload as number };
      case 'showLoading':
        return { ...state, isLoading: true };
      case 'showContent':
        return { ...state, isLoading: false, isSettingsOpen: false, fetchError: null };
      case 'setFetchError':
        return { ...state, isLoading: false, fetchError: action.payload as string };
      default:
        if (subReducer) {
          return subReducer(state, action);
        } else {
          throw new ReferenceError(`action ${action.type} does not exist on reducer`);
        }
    }
  }

  const [state, dispatch] = useReducer(reducer, widget);

  // Save updates to widget as changes are made
  useWidgetUpdater(state);

  return [state, dispatch];

}

function WidgetShell({ widget, dispatch, provided, children }: { widget: WidgetState, dispatch: Function, provided: DraggableProvided, children: JSX.Element | JSX.Element[] }) {

  const WidgetContents = widgetTypeMap[widget.type];

  const { dispatchToApp } = useContext(AppContext);

  // Signal to the global application that we want to remove the widget
  function removeWidget() {
    const confirmation = confirm('Are you sure you want to permanently delete this widget?');
    if (confirmation) {
      dispatchToApp({ type: 'removeWidget', payload: widget });
    }
  }

  function handleResize(event: React.MouseEvent) {
    const newHeight = parseFloat((event.currentTarget as HTMLElement).style.height);
    // Only trigger the resizeWidget action when the height actually changes
    // (this is to prevent the action from firing whenever mouseUp is called,
    // which could be all the time)
    if (newHeight && newHeight !== widget.height) {
      dispatch({ type: 'resizeWidget', payload: newHeight });
    }
  }

  // Enforce any user-defined height of the widget (at least when the height is
  // adjustable for that specific widget type)
  const widgetStyles = {
    height: widget.height,
    ...provided.draggableProps.style
  };

  return (
    <article className={`widget widget-type-${widget.type} ${widget.isSettingsOpen ? 'widget-settings-open' : ''}`} ref={provided.innerRef} {...provided.draggableProps} style={widgetStyles} onMouseUp={(event) => handleResize(event)}>
      <div className="widget-controls widget-controls-left">
        <div className="widget-drag-handle widget-control" {...provided.dragHandleProps}>
          <img
            src="icons/drag-handle-light.svg"
            alt="Drag Widget"
            draggable="false"
            className="widget-drag-handle-icon widget-control-icon" />
        </div>
      </div>
      <div className="widget-controls widget-controls-right">
        <button className="widget-remove-control widget-control" onClick={() => removeWidget()}>
          <img
            src="icons/remove-circle-light.svg"
            alt="Remove Widget"
            className="widget-remove-control-icon widget-control-icon"
            draggable="false" />
        </button>
        <button className="widget-settings-toggle widget-control" onClick={(event) => dispatch({ type: 'toggleSettings' })}>
          <img
            src="icons/settings-light.svg"
            alt="Toggle Settings"
            draggable="false"
            className="widget-settings-toggle-icon widget-control-icon" />
        </button>
      </div>
      {widget.isLoading ? (
        <LoadingIndicator />
      ) : children}
    </article>
  );

}

export default WidgetShell;
