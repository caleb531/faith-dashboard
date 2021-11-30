export interface BibleVerseMeta {
  canonical: string;
  chapter_end: number[];
  chapter_start: number[];
  next_chapter: number[];
  next_verse: number;
  prev_chapter: number[];
  prev_verse: number;
}

export interface BibleVerseData {
  canonical: string;
  parsed: number[];
  passage_meta: BibleVerseMeta[];
  passages: string[];
  query: string;
}
