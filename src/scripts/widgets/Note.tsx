import React, { useContext, useReducer } from 'react';
import { debounce } from 'lodash';
import { WidgetState, WidgetDataState, WidgetContentsParameters } from '.../types/Widget.d';
import { useWidgetUpdater } from '../hooks';

export function reducer(state, action): WidgetDataState {
  switch (action.type) {
    case 'updateText':
      return { ...state, text: action.payload };
    case 'updateFontSize':
      return { ...state, fontSize: action.payload };
    default:
      return state;
  }
}

function BibleVerse({ widget, widgetData, dispatchWidget }: WidgetContentsParameters) {

  const [state, dispatch] = useReducer(reducer, widgetData);
  const { fontSize, text } = state as { fontSize: number, text: string };
  // The amount of time (in milliseconds) after the user's last keystroke
  // before assuming that the user has stopped typing
  const saveDelay = 300;
  const defaultFontSize = 14;
  const textStyles = {
    fontSize: fontSize || defaultFontSize
  };

  const queueChangeWhenTypingStops = debounce(function (text) {
    dispatch({ type: 'updateText', payload: text });
  }, saveDelay);

  // Register a change of the user's preferred font size for this note
  function changeFontSize(event) {
    dispatch({ type: 'updateFontSize', payload: Number(event.target.value) });
  }

  // Register a change of the user-entered text for this note
  function changeText(event) {
    queueChangeWhenTypingStops(event.target.value);
  }

    // Save updates to widget as changes are made
  useWidgetUpdater(widget, state);

  return (
    <section className="note">
      {widget.isSettingsOpen ? (
        <>
          <h3 className="note-heading">Note</h3>
          <form className="note-formatting">
            <input
              type="range"
              className="note-formatting-font-size"
              onInput={(event) => changeFontSize(event)}
              min="12"
              max="50"
              value={fontSize || defaultFontSize} />
            <div className="note-formatting-preview" style={textStyles}>Example Text</div>
          </form>
        </>
      ) : (
        <textarea
          className="note-text-box"
          onInput={changeText}
          placeholder="Type your note here..."
          defaultValue={text}
          style={textStyles}></textarea>
      )}
    </section>
  );

}

export default BibleVerse;
