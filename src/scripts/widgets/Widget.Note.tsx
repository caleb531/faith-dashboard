import React, { useReducer } from 'react';
import { debounce } from 'lodash-es';
import { WidgetDataState, StateAction, WidgetContentsParameters } from '../types';
import { useWidgetUpdater } from '../hooks';

export function reducer(state: WidgetDataState, action: StateAction): WidgetDataState {
  switch (action.type) {
    case 'updateText':
      return { ...state, text: action.payload };
    case 'updateFontSize':
      return { ...state, fontSize: action.payload };
    default:
      return state;
  }
}

function Note({ widget, widgetData }: WidgetContentsParameters) {

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
  function changeFontSize(event: React.FormEvent): void {
    dispatch({ type: 'updateFontSize', payload: Number((event.target as HTMLInputElement).value) });
  }

  // Register a change of the user-entered text for this note
  function changeText(event: React.FormEvent): void {
    queueChangeWhenTypingStops((event.target as HTMLTextAreaElement).value);
  }

    // Save updates to widget as changes are made
  useWidgetUpdater(widget, state);

  return (
    <section className="note">
      {widget.isSettingsOpen ? (
        <>
          <h2 className="note-heading">Note</h2>
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

export default Note;
