import React from 'react';
import useUniqueFieldId from '../../useUniqueFieldId';
import useWidgetShell from '../useWidgetShell';
import { WidgetParameters } from '../widget.d';
import WidgetShell from '../WidgetShell';
import reducer from './NoteReducer';

const NoteWidget = React.memo(function NoteWidget({
  widgetHead,
  provided
}: WidgetParameters) {
  const [widget, dispatch] = useWidgetShell(reducer, widgetHead);
  const { fontSize, text } = widget;
  // The amount of time (in milliseconds) after the user's last keystroke
  // before assuming that the user has stopped typing
  const defaultFontSize = 14;
  const textStyles = {
    fontSize: fontSize || defaultFontSize
  };

  // Set the percentage fill of the slider
  function setSliderFill(input: HTMLInputElement) {
    if (!input) {
      return;
    }
    const fillPercentage =
      ((Number(input.value) - Number(input.min)) /
        (Number(input.max) - Number(input.min))) *
      100;
    input.style.setProperty('--slider-fill-percentage', `${fillPercentage}%`);
  }

  // Register a change of the user's preferred font size for this note
  function changeFontSize(event: React.FormEvent): void {
    const input = event.target as HTMLInputElement;
    setSliderFill(input);
    dispatch({ type: 'updateFontSize', payload: Number(input.value) });
  }

  // Register a change of the user-entered text for this note
  function changeText(event: React.FormEvent): void {
    const textarea = event.target as HTMLTextAreaElement;
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
    const a = -4 / 19; // When font size is 12, word count should be 10
    const b = 238 / 19; // When font size is 50, word count should be 2
    const maxExcerptWordCount = a * currentFontSize + b;
    return (
      words.slice(0, maxExcerptWordCount).join(' ') +
      (originalWordCount > maxExcerptWordCount ? '...' : '')
    );
  }

  const textBoxId = useUniqueFieldId('note-text');

  return (
    <WidgetShell
      widget={widget}
      dispatchToWidget={dispatch}
      provided={provided}
    >
      <section className="note">
        {widget.isSettingsOpen ? (
          <>
            <h2 className="note-heading">Note</h2>
            <form className="note-formatting">
              <label
                htmlFor={`note-formatting-font-size-${widget.id}`}
                className="bible-verse-search"
              >
                Font Size
              </label>
              <input
                type="range"
                id={`note-formatting-font-size-${widget.id}`}
                className="note-formatting-font-size"
                onInput={(event) => changeFontSize(event)}
                min="12"
                max="50"
                value={fontSize || defaultFontSize}
                ref={setSliderFill}
              />
              <div className="note-formatting-preview" style={textStyles}>
                {getTextPreview(text)}
              </div>
            </form>
          </>
        ) : (
          <>
            <label htmlFor={textBoxId} className="accessibility-only">
              Note Text
            </label>
            <textarea
              className="note-text-box"
              id={textBoxId}
              onInput={changeText}
              placeholder="Type your note here..."
              value={text}
              style={textStyles}
            ></textarea>
          </>
        )}
      </section>
    </WidgetShell>
  );
});

export default NoteWidget;
