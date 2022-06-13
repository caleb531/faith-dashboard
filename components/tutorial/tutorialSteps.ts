import { TutorialStep } from './tutorial.d';

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    message: 'Welcome to Faith Dashboard, your personalized home for strength and encouragement every day.',
    position: 'center',
    alignment: 'center',
    width: 280,
    primaryButtonLabel: 'Get Started'
  },
  {
    id: 'dashboard',
    message: 'This is your dashboard. It has different types of "widgets" that help inspire your faith.',
    position: 'center',
    alignment: 'center',
    width: 320
  },
  {
    id: 'widget-bible-verse-1',
    message: 'Search for a verse to post to your dashboard with the Bible Verse widget.',
    position: 'auto',
    alignment: 'left',
    width: '100%'
  },
  {
    id: 'widget-note-1',
    message: 'Type something encouraging or whatever you want with the Note widget.',
    position: 'auto',
    alignment: 'left',
    width: '100%'
  },
  {
    id: 'widget-podcast-1',
    message: 'Listen to your favorite sermons or other podcasts with the Podcast widget.',
    position: 'auto',
    alignment: 'left',
    width: '100%'
  },
  {
    id: 'add-widget',
    message: 'Add more widgets at any time!',
    position: 'bottom',
    alignment: 'center',
    width: 'max-content'
  },
  {
    id: 'change-theme',
    message: 'Change your board\'s theme to personalize it!',
    position: 'bottom',
    alignment: 'right'
  },
  {
    id: 'remove-widget-bible-verse-2',
    message: 'Remove any widget you don\'t want with the minus (-) icon.',
    position: 'auto',
    alignment: 'right'
  },
  {
    id: 'configure-widget-bible-verse-2',
    message: 'Tweak the settings for any widget with the Gear icon.',
    position: 'auto',
    alignment: 'right'
  },
  {
    id: 'drag-widget-bible-verse-2',
    message: 'And, you can rearrange your widgets with the drag-handle icon on any widget.',
    position: 'auto',
    positionPrecedence: ['left', 'right', 'top', 'bottom'],
    alignment: 'left'
  },
  {
    id: 'help',
    message: 'Finally, if you ever need help, click the Help link at the bottom of the page.',
    position: 'top',
    alignment: 'center'
  },
  {
    id: 'completed',
    message: 'And that\'s it! May this dashboard help you grow closer to Jesus.',
    position: 'center',
    alignment: 'center',
    width: 260
  }
];

export default tutorialSteps;
