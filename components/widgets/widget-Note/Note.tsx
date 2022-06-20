import React from 'react';
import useWidgetShell from '../useWidgetShell';
import { WidgetParameters } from '../widget.d';
import WidgetShell from '../WidgetShell';
import { NoteWidgetState } from './note.d';
import reducer from './NoteReducer';

const NoteWidget = React.memo(function NoteWidget({ widgetHead, provided }: WidgetParameters) {

  const [state, dispatch] = useWidgetShell(reducer, widgetHead);
  const { fontSize, text } = state as NoteWidgetState;
  // The amount of time (in milliseconds) after the user's last keystroke
  // before assuming that the user has stopped typing
  const defaultFontSize = 14;
  const textStyles = {
    fontSize: fontSize || defaultFontSize
  };

  // Register a change of the user's preferred font size for this note
  function changeFontSize(event: React.FormEvent): void {
    const input = (event.target as HTMLInputElement);
    dispatch({ type: 'updateFontSize', payload: Number(input.value) });
  }

  // Register a change of the user-entered text for this note
  function changeText(event: React.FormEvent): void {
    const textarea = (event.target as HTMLTextAreaElement);
    dispatch({ type: 'updateText', payload: textarea.value });
  }

  // Return a truncated excerpt of the entered text for display as the Font
  // Size preview text
  function getTextPreview(text: string): string {
    if (!text) {
      return 'Example Text';
    }
    const words = text.trim().split(' ');
    const originalWordCount = words.length;
    const currentFontSize = fontSize || defaultFontSize;
    // Use a linear equation of the form (y = ax + b) to represent the number
    // of words we want to show given a particular font size; the below
    // constants can be adjusted to change; in our equation, y is the desired
    // word count, and b is the font size at a given instant
    const a = (-4 / 19); // When font size is 12, word count should be 10
    const b = (238 / 19); // When font size is 50, word count should be 2
    const maxExcerptWordCount = (a * currentFontSize) + b;
    return (
      words.slice(0, maxExcerptWordCount).join(' ')
      +
      ((originalWordCount > maxExcerptWordCount) ? '...' : '')
    );
  }

  return (
    <WidgetShell widget={state} dispatch={dispatch} provided={provided}>
      <section className="note">
        {state.isSettingsOpen ? (
          <>
            <h2 className="note-heading">Note</h2>
            <form className="note-formatting">
              <label htmlFor={`note-formatting-font-size-${state.id}`} className="bible-verse-search">
                Font Size
              </label>
              <input
                type="range"
                id={`note-formatting-font-size-${state.id}`}
                className="note-formatting-font-size"
                onInput={(event) => changeFontSize(event)}
                min="12"
                max="50"
                value={fontSize || defaultFontSize} />
              <div className="note-formatting-preview" style={textStyles}>{getTextPreview(text)}</div>
            </form>
          </>
        ) : (
          <textarea
            className="note-text-box"
            onInput={changeText}
            placeholder="Type your note here..."
            value={text}
            style={textStyles}></textarea>
        )}
      </section>
    </WidgetShell>
  );

});

export default NoteWidget;
