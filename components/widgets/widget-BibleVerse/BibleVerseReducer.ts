import { BibleVerseWidgetState } from './bibleVerse.d';

export type BibleVerseAction =
  { type: 'setVerseContent', payload: string | null } |
  { type: 'setVerseQuery', payload: string };

export default function reducer(
  state: BibleVerseWidgetState,
  action: BibleVerseAction
): BibleVerseWidgetState {
  switch (action.type) {
    case 'setVerseContent':
      const verseContent = action.payload;
      return { ...state, verseContent };
    case 'setVerseQuery':
      const verseQuery = action.payload;
      return { ...state, verseQuery, verseContent: null };
    default:
      return state;
  }
}
