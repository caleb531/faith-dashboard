import React, { Suspense } from 'react';
import LoadingIndicator from '../generic/LoadingIndicator';
import TutorialWrapper from '../tutorial/TutorialWrapper';
import useMountListener from '../useMountListener';
import useTouchDeviceDetection from '../useTouchDeviceDetection';
import AppCompletedTutorial from './AppCompletedTutorial';
import AppContext from './AppContext';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import AppWelcome from './AppWelcome';
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

function App() {

  const [app, dispatchToApp] = useApp();

  useTouchDeviceDetection();

  const isMounted = useMountListener();
  return (
    <AppContext.Provider value={dispatchToApp}>
        {isMounted ? <div className="app">
          <TutorialWrapper shouldShow={Boolean(app.shouldShowTutorial)}>
            {shouldLoadServiceWorker() ? (
              <UpdateNotification />
            ) : null}
            <AppHeader currentTheme={app.theme} />
            <AppWelcome />
            <AppCompletedTutorial />
            <Suspense fallback={<LoadingIndicator />}>
              <WidgetBoard widgets={app.widgets} />
            </Suspense>
            <AppFooter />
          </TutorialWrapper>
        </div> : null}
    </AppContext.Provider>
  );

}

export default App;
