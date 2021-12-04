import React, { useCallback } from 'react';
import { debounce } from 'lodash-es';
import { StateAction, WidgetContentsParameters } from '../types.d';
import { NoteWidgetState } from './Widget.Note.d';
import WidgetShell from './WidgetShell';
import useWidgetShell from './useWidgetShell';

export function reducer(state: NoteWidgetState, action: StateAction): NoteWidgetState {
  switch (action.type) {
    case 'updateText':
      const text = action.payload as string;
      return { ...state, text };
    case 'updateFontSize':
      const fontSize = action.payload as number;
      return { ...state, fontSize };
    default:
      throw new ReferenceError(`action ${action.type} does not exist on reducer`);
  }
}

function NoteWidget({ widget, provided }: WidgetContentsParameters) {

  const [state, dispatch] = useWidgetShell(reducer, widget);
  const { fontSize, text } = state as NoteWidgetState;
  // The amount of time (in milliseconds) after the user's last keystroke
  // before assuming that the user has stopped typing
  const saveDelay = 300;
  const defaultFontSize = 14;
  const textStyles = {
    fontSize: fontSize || defaultFontSize
  };

  // Cache the debounced function so that its internal debounce timer
  // transcends across render passes (otherwise, the debounce timer would
  // effectively be reset on every render)
  const queueChangeWhenTypingStops = useCallback(debounce(function (text) {
    dispatch({ type: 'updateText', payload: text });
  }, saveDelay), []);

  // Register a change of the user's preferred font size for this note
  function changeFontSize(event: React.FormEvent): void {
    dispatch({ type: 'updateFontSize', payload: Number((event.target as HTMLInputElement).value) });
  }

  // Register a change of the user-entered text for this note
  function changeText(event: React.FormEvent): void {
    queueChangeWhenTypingStops((event.target as HTMLTextAreaElement).value);
  }

  return (
    <WidgetShell widget={state} dispatch={dispatch} provided={provided}>
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
    </WidgetShell>
  );

}

export default NoteWidget;
