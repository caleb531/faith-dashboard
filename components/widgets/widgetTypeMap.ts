import BibleVerseWidget from './widget-BibleVerse/BibleVerse';
import NoteWidget from './widget-Note/Note';
import PodcastWidget from './widget-Podcast/Podcast';

// Map widget type IDs to their corresponding components
const widgetTypeMap = {
  BibleVerse: BibleVerseWidget,
  Note: NoteWidget,
  Podcast: PodcastWidget
};

export default widgetTypeMap;
