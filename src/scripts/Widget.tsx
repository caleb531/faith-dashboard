import React, { useContext, useReducer } from 'react';
import { AppContext } from './AppContext';
import { WidgetState } from './Widget.d';
import WidgetTypes from './WidgetTypes';

function Widget({ widget }: { widget: WidgetState }) {

  const { app, dispatchApp } = useContext(AppContext);

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

  const widgetStyles = {
    width: widget.width
  };

  const WidgetContents = WidgetTypes[widget.type];

  return (
    <article className={`widget ${state.isSettingsOpen ? 'widget-settings-open' : ''}`} style={widgetStyles}>
      <img src="icons/settings.svg" alt="Toggle Settings" className="widget-settings-toggle" onClick={(event) => dispatch({type: 'toggleSettings'})} />
      <WidgetContents widget={state} widgetData={state.data} dispatchWidget={dispatch} dispatchApp={dispatchApp} />
    </article>
  );

}

export default Widget;
