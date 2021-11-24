import React, { useReducer, useContext } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { AppContext } from './AppContext';
import { WidgetState } from '../types/Widget.d';
import widgetTypeMap from './widgetTypeMap';

export function reducer(state, action): WidgetState {
  switch (action.type) {
    case 'toggleSettings':
      return { ...state, isSettingsOpen: !state.isSettingsOpen };
    case 'openSettings':
      return { ...state, isSettingsOpen: true };
    case 'closeSettings':
      return { ...state, isSettingsOpen: false };
    case 'resizeWidget':
      return { ...state, height: action.payload };
    default:
      return state;
  }
}

function Widget({ widget, provided }: { widget: WidgetState, provided: DraggableProvided }) {

  const [state, dispatch] = useReducer(reducer, widget);
  const WidgetContents = widgetTypeMap[widget.type];

  const { dispatchApp } = useContext(AppContext);

  // Signal to the global application that we want to remove the widget
  function removeWidget() {
    const confirmation = confirm('Are you sure you want to permanently delete this widget?');
    if (confirmation) {
      dispatchApp({ type: 'removeWidget', payload: state });
    }
  }

  function handleResize(event) {
    const newHeight = parseFloat(event.currentTarget.style.height);
    // Only trigger the resizeWidget action when the height actually changes
    // (this is to prevent the action from firing whenever mouseUp is called,
    // which could be all the time)
    if (newHeight && newHeight !== state.height) {
      dispatch({ type: 'resizeWidget', payload: newHeight });
    }
  }

  // Enforce any user-defined height of the widget (at least when the height is
  // adjustable for that specific widget type)
  const widgetStyles = {
    height: state.height,
    ...provided.draggableProps.style
  };

  return (
    <article className={`widget widget-type-${widget.type} ${state.isSettingsOpen ? 'widget-settings-open' : ''}`} ref={provided.innerRef} {...provided.draggableProps} style={widgetStyles} onMouseUp={handleResize}>
      <div className="widget-controls widget-controls-left">
        <img
          src="icons/drag-handle-light.svg"
          alt="Drag Widget"
          draggable="false"
          className="widget-drag-handle widget-control" {...provided.dragHandleProps} />
      </div>
      <div className="widget-controls widget-controls-right">
        <img
          src="icons/remove-circle-light.svg"
          alt="Remove Widget"
          className="widget-remove-control widget-control"
          draggable="false"
          onClick={() => removeWidget()} />
        <img
          src="icons/settings-light.svg"
          alt="Toggle Settings"
          draggable="false"
          className="widget-settings-toggle widget-control"
          onClick={(event) => dispatch({ type: 'toggleSettings' })} />
      </div>
      <WidgetContents widget={state} widgetData={state.data} dispatchWidget={dispatch} />
    </article>
  );

}

export default Widget;
