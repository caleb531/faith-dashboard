import { AppState } from './app.d';


export default {
  theme: 'teal',
  shouldShowGettingStarted: true,
  widgets: [
    {
      id: '2c342850-2237-4dab-8b08-b10cae7c7a4e',
      type: 'BibleVerse',
      column: 1
    },
    {
      id: '50546223-76c8-4643-a402-87c4cf213849',
      type: 'Note',
      column: 1
    },
    {
      id: '4deca405-3e4e-4baa-94c8-82ebf5bcbcde',
      type: 'BibleVerse',
      column: 2
    },
    {
      id: 'ac67b3fc-7c60-463a-b0cd-2301cb8e0b0a',
      type: 'Podcast',
      column: 3,
      podcastQuery: 'sermon of the day'
    }
  ]
} as AppState;
