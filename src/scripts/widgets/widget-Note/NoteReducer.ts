import { NoteWidgetState } from './note.d';

export type NoteAction =
  { type: 'updateText', payload: string } |
  { type: 'updateFontSize', payload: number };

export default function reducer(state: NoteWidgetState, action: NoteAction): NoteWidgetState {
  switch (action.type) {
    case 'updateText':
      const text = action.payload as string;
      return { ...state, text };
    case 'updateFontSize':
      const fontSize = action.payload as number;
      return { ...state, fontSize };
    default:
      return state;
  }
}
