import React, { useContext, useReducer } from 'react';
import { debounce } from 'lodash';
import { WidgetState, WidgetDataState, WidgetContentsParameters } from '../Widget.d';
import { useWidgetUpdater } from '../hooks';

function BibleVerse({ widget, widgetData, dispatchWidget }: WidgetContentsParameters) {

  function reducer(state, action): WidgetDataState {
    switch (action.type) {
      case 'changeText':
        return {...state, text: action.payload};
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, widgetData);
  const saveDelay = 300;

  const queueChangeWhenTypingStops = debounce(function (text) {
    dispatch({type: 'changeText', payload: text});
  }, saveDelay);

  // Register a change of the user-entered text for this note
  function changeText(event) {
    queueChangeWhenTypingStops(event.target.value);
  }

    // Save updates to widget as changes are made
  useWidgetUpdater(widget, state);

  return (
    <section className="note">
      <textarea
        className="note-text-box"
        onInput={changeText}
        defaultValue={state.text}></textarea>
    </section>
  );

}

export default BibleVerse;
