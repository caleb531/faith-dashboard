import { WidgetTypeId } from '../scripts/types.d';

export default [
  {
    type: WidgetTypeId.BibleVerse,
    name: 'Bible Verse',
    description: 'Display a single verse or selection of verses on your dashboard. Bible content is in the ESV translation.',
    icon: 'book-dark'
  },
  {
    type: WidgetTypeId.Note,
    name: 'Note',
    description: 'Write down anything you\'d like—a quote, a phrase, a song, or even a word from the Lord. There are no limitations!',
    icon: 'sticky-note-dark'
  }
];
