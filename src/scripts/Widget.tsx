import React, { useReducer } from 'react';
import { WidgetState } from './Widget.d';
import WidgetTypes from './WidgetTypes';

function Widget({ widget, provided }: { widget: WidgetState, provided: any, [key: string]: any }) {

  function reducer(state, action) {
    switch (action.type) {
      case 'toggleSettings':
        return {...state, isSettingsOpen: !state.isSettingsOpen};
      case 'openSettings':
        return {...state, isSettingsOpen: true};
      case 'closeSettings':
        return {...state, isSettingsOpen: false};
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, widget);

  const WidgetContents = WidgetTypes[widget.type];

  return (
    <article className={`widget widget-type-${widget.type} ${state.isSettingsOpen ? 'widget-settings-open' : ''}`} ref={provided.innerRef} {...provided.draggableProps}>
      <div className="widget-header">
        <img src="icons/drag-handle.svg" alt="Drag Widget" className="widget-drag-handle widget-header-control" {...provided.dragHandleProps} />
        <img src="icons/settings.svg" alt="Toggle Settings" className="widget-settings-toggle widget-header-control" onClick={(event) => dispatch({type: 'toggleSettings'})} />
      </div>
      <WidgetContents widget={state} widgetData={state.data} dispatchWidget={dispatch} />
    </article>
  );

}

export default Widget;
