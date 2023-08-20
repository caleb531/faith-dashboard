import LandingPage from '@components/LandingPage';
import LinkButton from '@components/reusable/LinkButton';
import { getPageMetadata } from '@components/seoUtils';

async function Copyright() {
  return (
    <LandingPage heading="Copyright | Faith Dashboard">
      <p>
        Bible content provided by YouVersion and is copyright of the respective
        publishers.
      </p>

      <p>
        Photo backgrounds provided by{' '}
        <a href="https://unsplash.com/">Unsplash</a>.
      </p>

      <p>
        <LinkButton href="/">Return to App</LinkButton>
      </p>
    </LandingPage>
  );
}

/* istanbul ignore next */
export function generateMetadata() {
  return getPageMetadata({
    path: '/copyright',
    title: 'Copyright | Faith Dashboard',
    description:
      'Copyright information for Faith Dashboard, your home for strength and encouragement every day.'
  });
}

export default Copyright;
