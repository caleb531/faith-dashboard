import { v4 as uuidv4 } from 'uuid';
import { AppState } from './app.types';

export function getDefaultAppState() {
  return {
    isDefaultApp: true,
    name: 'Main Dashboard',
    theme: 'shore',
    shouldShowTutorial: true,
    widgets: [
      {
        id: uuidv4(),
        type: 'BibleVerse',
        column: 1,
        tutorialStepId: 'bible-verse-1'
      },
      {
        id: uuidv4(),
        type: 'Note',
        column: 1,
        tutorialStepId: 'note-1'
      },
      {
        id: uuidv4(),
        type: 'BibleVerse',
        column: 2,
        tutorialStepId: 'bible-verse-2'
      },
      {
        id: uuidv4(),
        type: 'Podcast',
        column: 3,
        podcastQuery: 'sermon of the day',
        tutorialStepId: 'podcast-1'
      }
    ]
  } as AppState;
}
