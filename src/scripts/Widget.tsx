import React, { useReducer } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
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
      <div className="widget-header">
        <img src="icons/drag-handle.svg" alt="Drag Widget" className="widget-drag-handle widget-header-control" {...provided.dragHandleProps} />
        <img src="icons/settings.svg" alt="Toggle Settings" className="widget-settings-toggle widget-header-control" onClick={(event) => dispatch({ type: 'toggleSettings' })} />
      </div>
      <WidgetContents widget={state} widgetData={state.data} dispatchWidget={dispatch} />
    </article>
  );

}

export default Widget;
