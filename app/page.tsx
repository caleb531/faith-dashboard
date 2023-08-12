import React, { Suspense } from 'react';
import App from '../components/app/App';
import AppCompletedTutorial from '../components/app/AppCompletedTutorial';
import AppWelcome from '../components/app/AppWelcome';
import LoadingIndicator from '../components/reusable/LoadingIndicator';

const WidgetBoard = React.lazy(
  () => import('../components/widgets/WidgetBoard')
);

function Home() {
  return (
    <App enableTutorial canAddWidgets>
      <AppWelcome />
      <AppCompletedTutorial />
      <Suspense fallback={<LoadingIndicator />}>
        <WidgetBoard />
      </Suspense>
    </App>
  );
}

export default Home;
