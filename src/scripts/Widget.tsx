import React, { useReducer } from 'react';
import { WidgetState } from './Widget.d';
import WidgetTypes from './WidgetTypes';

function Widget({ widget }: { widget: WidgetState }) {

  function reducer(state, action) {
    switch (action.type) {
      case 'toggleSettings':
        return {...state, isSettingsOpen: !state.isSettingsOpen};
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, widget);

  const widgetStyles = {
    width: widget.width
  };

  const WidgetContents = WidgetTypes[widget.type];

  return (
    <article className={`widget ${state.isSettingsOpen ? 'widget-settings-open' : ''}`} style={widgetStyles}>
      <img src="icons/settings.svg" alt="Toggle Settings" className="widget-settings-toggle" onClick={(event) => dispatch({type: 'toggleSettings'})} />
      <WidgetContents widget={state} widgetData={state.data} />
    </article>
  );

}

export default Widget;
