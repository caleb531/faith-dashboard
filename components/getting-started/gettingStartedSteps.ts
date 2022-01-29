import { GettingStartedStep } from './gettingStarted';

const gettingStartedSteps: GettingStartedStep[] = [
  {
    id: 'welcome',
    message: 'Welcome to Faith Dashboard!',
    position: 'middle',
    alignment: 'center',
    width: 'auto',
    primaryButtonLabel: 'Get Started'
  },
  {
    id: 'widget-board',
    message: 'This is your dashboard. It has different types of "widgets" that help inspire your faith',
    position: 'middle',
    alignment: 'center',
    width: 320
  },
  {
    id: 'widget-2c342850-2237-4dab-8b08-b10cae7c7a4e',
    message: 'Search for a verse to post to your dashboard with the Bible Verse widget',
    position: 'auto',
    alignment: 'left',
    width: '100%'
  },
  {
    id: 'widget-50546223-76c8-4643-a402-87c4cf213849',
    message: 'Type something encouraging or whatever you want with the Note widget',
    position: 'auto',
    alignment: 'left',
    width: '100%'
  },
  {
    id: 'widget-ac67b3fc-7c60-463a-b0cd-2301cb8e0b0a',
    message: 'Listen to your favorite sermons or other podcasts with the Podcast widget',
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
    message: 'And finally, change your board\'s color theme to personalize it!',
    position: 'bottom',
    alignment: 'right',
    width: 300
  },
  {
    id: 'help',
    message: 'Finally, if you ever need help, click the Help link at the bottom of the page',
    position: 'top',
    alignment: 'center',
    width: 200
  },
  {
    id: 'completed',
    message: 'And that\'s it! May this dashboard help you grow closer to Jesus',
    position: 'middle',
    alignment: 'center'
  }
];

export default gettingStartedSteps;
