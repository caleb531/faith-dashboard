import React, { Suspense } from 'react';
import App from '../components/app/App';
import AppCompletedTutorial from '../components/app/AppCompletedTutorial';
import AppWelcome from '../components/app/AppWelcome';
import LoadingIndicator from '../components/generic/LoadingIndicator';
import useMountListener from '../components/useMountListener';
import WidgetBoard from '../components/widgets/WidgetBoard';

function Home() {

  const isMounted = useMountListener();

  return (
    <App enableTutorial={true} canAddWidgets={true}>
      {(app) => isMounted ? <>
        <AppWelcome />
        <AppCompletedTutorial />
        <Suspense fallback={<LoadingIndicator />}>
          <WidgetBoard widgets={app.widgets} />
        </Suspense>
      </> : <LoadingIndicator />}
    </App>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pagePath: '/',
      pageTitle: 'Faith Dashboard',
      pageDescription: 'Be strengthened every day with this private board for your favorite Bible verses, sermons, and anything else you need to be encouraged when life happens.'
    }
  };
}

export default Home;
