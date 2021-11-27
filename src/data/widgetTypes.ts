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
  },
  {
    type: WidgetTypeId.Podcast,
    name: 'Podcast',
    description: 'Subscribe to any podcast from Apple Podcasts. This could be a Sermon of the Day podcast, or some other faith-based podcast like "Ask Pastor John".',
    icon: 'podcast-dark'
  }
];
