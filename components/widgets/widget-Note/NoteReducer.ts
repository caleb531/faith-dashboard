import { WidgetAction } from '../useWidgetShell';
import { NoteWidgetState } from './note.d';

export type NoteAction =
  | WidgetAction
  | { type: 'updateText'; payload: string }
  | { type: 'updateFontSize'; payload: number };

export default function reducer(
  state: NoteWidgetState,
  action: NoteAction
): NoteWidgetState {
  switch (action.type) {
    case 'updateText':
      const text = action.payload;
      return { ...state, text };
    case 'updateFontSize':
      const fontSize = action.payload;
      return { ...state, fontSize };
    default:
      return state;
  }
}
