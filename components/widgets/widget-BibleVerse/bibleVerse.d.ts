import { WidgetState } from '../widget.d';

export interface BibleVerseWidgetState extends WidgetState {
  verseQuery: string;
  verseContent: BibleReference | null;
}

export interface BibleReference {
  id: string;
  name: string;
  url: string;
  book: BibleReferenceBook;
  chapter: number;
  verse: number;
  endVerse: null;
  version: BibleVersion;
  content: string;
}

export interface BibleReferenceBook {
  id: string;
  name: string;
  priority: number;
  metadata: BibleReferenceMetadata;
}

export interface BibleReferenceMetadata {
  canon: string;
  chapters: number;
  verses: number[];
}

export interface BibleVersion {
  full_name: string;
  id: number;
  name: string;
}
