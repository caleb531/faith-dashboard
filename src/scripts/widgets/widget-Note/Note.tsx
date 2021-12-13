import { debounce } from 'lodash-es';
import React, { useMemo } from 'react';
import { StateAction, WidgetParameters } from '../../types.d';
import useWidgetShell from '../useWidgetShell';
import WidgetShell from '../WidgetShell';
import { NoteWidgetState } from './Note.d';

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

const NoteWidget = React.memo(function NoteWidget({ widget, provided }: WidgetParameters) {

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
  // effectively be reset on every render); useMemo will also provide us access
  // to the original (cancelable) return value of debounce(); for more
  // information, see:
  // <https://github.com/facebook/react/issues/19240#issuecomment-652945246>
  // <https://github.com/facebook/react/issues/19240#issuecomment-867885511>
  const queueChangeWhenTypingStops = useMemo(() => {
    return debounce((text) => {
      dispatch({ type: 'updateText', payload: text });
    }, saveDelay);
  }, [dispatch]);

  // Register a change of the user's preferred font size for this note
  function changeFontSize(event: React.FormEvent): void {
    const input = (event.target as HTMLInputElement);
    dispatch({ type: 'updateFontSize', payload: Number(input.value) });
  }

  // Register a change of the user-entered text for this note
  function changeText(event: React.FormEvent): void {
    const textarea = (event.target as HTMLTextAreaElement);
    queueChangeWhenTypingStops(textarea.value);
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
    // Use a linear equation of the form (ax + b) to represent the number of
    // words we want to show given a particular font size; the below constants
    // can be adjusted to change
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
        {widget.isSettingsOpen ? (
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
            defaultValue={text}
            style={textStyles}></textarea>
        )}
      </section>
    </WidgetShell>
  );

});

export default NoteWidget;
