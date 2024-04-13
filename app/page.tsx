import App from '@components/app/App';
import AppCompletedTutorial from '@components/app/AppCompletedTutorial';
import AppWelcome from '@components/app/AppWelcome';
import { getSession, getUser } from '@components/authUtils.server';
import LoadingIndicator from '@components/reusable/LoadingIndicator';
import { getPageMetadata } from '@components/seoUtils';
import React, { Suspense } from 'react';

const WidgetBoard = React.lazy(() => import('@components/widgets/WidgetBoard'));

async function Home() {
  const user = await getUser();
  const session = await getSession();
  return (
    <App
      enableTutorial
      canAddWidgets
      isClientOnly
      session={session}
      user={user}
    >
      <AppWelcome />
      <AppCompletedTutorial />
      <Suspense fallback={<LoadingIndicator />}>
        <WidgetBoard />
      </Suspense>
    </App>
  );
}

export function generateMetadata() {
  return getPageMetadata({
    path: '/',
    title: 'Faith Dashboard',
    description:
      'Be strengthened every day with this private board for your favorite Bible verses, sermons, and anything else you need to be encouraged when life happens.'
  });
}

export default Home;
