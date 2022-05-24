import React, { Suspense } from 'react';
import App from '../components/app/App';
import AppCompletedTutorial from '../components/app/AppCompletedTutorial';
import AppWelcome from '../components/app/AppWelcome';
import LoadingIndicator from '../components/generic/LoadingIndicator';
import WidgetBoard from '../components/widgets/WidgetBoard';

function Home() {



  return (
    <App enableTutorial={true}>
      {(app) => <>
        <AppWelcome />
        <AppCompletedTutorial />
        <Suspense fallback={<LoadingIndicator />}>
          <WidgetBoard widgets={app.widgets} />
        </Suspense>
      </>}
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
