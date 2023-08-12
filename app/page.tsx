'use client';
import React, { Suspense } from 'react';
import App from '../components/app/App';
import AppCompletedTutorial from '../components/app/AppCompletedTutorial';
import AppWelcome from '../components/app/AppWelcome';
import LoadingIndicator from '../components/reusable/LoadingIndicator';
import useMountListener from '../components/useMountListener';

const WidgetBoard = React.lazy(
  () => import('../components/widgets/WidgetBoard')
);

function Home() {
  const isMounted = useMountListener();

  return (
    <App enableTutorial={true} canAddWidgets={true}>
      {(app) =>
        isMounted ? (
          <>
            <AppWelcome />
            <AppCompletedTutorial />
            <Suspense fallback={<LoadingIndicator />}>
              <WidgetBoard widgets={app.widgets} />
            </Suspense>
          </>
        ) : (
          <LoadingIndicator />
        )
      }
    </App>
  );
}

export default Home;
