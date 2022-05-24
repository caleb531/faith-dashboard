import React from 'react';
import TutorialWrapper from '../tutorial/TutorialWrapper';
import useMountListener from '../useMountListener';
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
  children: (app: AppState) => JSX.Element | (JSX.Element | null)[] | null,
}

function App({
  enableTutorial = false,
  children
}: Props) {

  const [app, dispatchToApp] = useApp();

  useTouchDeviceDetection();

  const isMounted = useMountListener();
  return (
    <AppContext.Provider value={dispatchToApp}>
      {isMounted ? <div className="app">
        {shouldLoadServiceWorker() ? (
          <UpdateNotification />
        ) : null}
        <TutorialWrapper shouldShow={Boolean(app.shouldShowTutorial && enableTutorial)}>
          <AppHeader currentTheme={app.theme} />
          <div className="app-contents">
            {children(app)}
          </div>
          <AppFooter />
        </TutorialWrapper>
      </div> : null}
    </AppContext.Provider>
  );

}

export default App;
