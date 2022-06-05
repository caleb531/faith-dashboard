import React from 'react';
import TutorialFlow from '../tutorial/TutorialFlow';
import useTouchDeviceDetection from '../useTouchDeviceDetection';
import { AppState } from './app.d';
import AppContext from './AppContext';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import UpdateNotification from './UpdateNotification';
import useApp from './useApp';

const WidgetBoard = React.lazy(() => import('../widgets/WidgetBoard'));

// Return a truthy value if the app's service worker should be loaded; the
// service worker always loads in a Production environment; however, by
// default, the service workr is *not* loaded in a local environment because
// other projects use localhost; this can be overridden via a single
// sessionStorage entry
function shouldLoadServiceWorker() {
  return typeof navigator !== 'undefined' && navigator.serviceWorker && (!window.location.hostname.includes('localhost') || sessionStorage.getItem('sw'));
}

type Props = {
  enableTutorial?: boolean,
  canAddWidgets?: boolean,
  children: (app: AppState) => JSX.Element | (JSX.Element | null)[] | null,
}

function App({
  enableTutorial = false,
  canAddWidgets = false,
  children
}: Props) {

  const [app, dispatchToApp] = useApp();

  useTouchDeviceDetection();

  return (
    <AppContext.Provider value={dispatchToApp}>
      <div className="app">
        {shouldLoadServiceWorker() ? (
          <UpdateNotification />
        ) : null}
        <TutorialFlow inProgress={Boolean(app.shouldShowTutorial && enableTutorial)}>
          <AppHeader currentTheme={app.theme} canAddWidgets={canAddWidgets} />
          <div className="app-contents">
            {children(app)}
          </div>
          <AppFooter />
        </TutorialFlow>
      </div>
    </AppContext.Provider>
  );

}

export default App;
