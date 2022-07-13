/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';
import Link from 'next/link';
import LandingPage from '../components/LandingPage';
import LinkButton from '../components/reusable/LinkButton';
import addToHomeScreenImage1 from '../public/images/help/ios-add-to-home-screen-ios-1.jpg';
import addToHomeScreenImage2 from '../public/images/help/ios-add-to-home-screen-ios-2.jpg';
import addToHomeScreenImage3 from '../public/images/help/ios-add-to-home-screen-ios-3.jpg';

function Help() {
  return (
    <LandingPage heading="Help | Faith Dashboard">
      <p>
        Be strengthened every day with Faith Dashboard, a private board for your
        favorite Bible verses, sermons, and anything else you need to be
        encouraged when life happens.
      </p>

      <h2>What can I do?</h2>

      <p>
        When you load the app for the first time, you'll see a three-column view
        with a few "widgets" for you to try. These widgets let you do things
        like:
      </p>

      <ul>
        <li>Display your favorite Bible verses</li>
        <li>Listen to your favorite faith podcast</li>
        <li>Jot down anything you'd like!</li>
      </ul>

      <p>You can also personalize your board with a photo or color theme!</p>

      <h3>Add new widget</h3>

      <p>
        You can add a new widget by clicking the{' '}
        <button type="button" disabled className="add-widget-button">
          <img src="/icons/add-light.svg" alt="" /> Add Widget
        </button>{' '}
        button at the top edge of the app. A panel will appear, allowing you to
        browse for a widget to add.
      </p>

      <p>
        When you've found your desired widget, click the{' '}
        <button type="button" disabled className="add-widget-button">
          <img src="/icons/add-light.svg" alt="" /> Add Widget
        </button>{' '}
        next to the widget listing. It will then automatically appear in the
        first column on your dashboard.
      </p>

      <h3>Rearranging widgets</h3>

      <p>
        You can move a widget to a different position or column with the{' '}
        <img src="/icons/drag-handle-light.svg" alt="Drag" /> icon in the
        top-left corner of any widget.
      </p>

      <h3>Deleting a widget</h3>

      <p>
        You can delete a widget from your dashboard via the{' '}
        <img src="/icons/remove-light.svg" alt="Remove" /> icon in the top-right
        corner of any widget. This will permanently delete the widget and its
        contents from your dashboard.
      </p>

      <h3>Changing settings</h3>

      <p>
        If you want to change which Bible verse you are displaying or which
        Podcast you are listening to, click the{' '}
        <img src="/icons/settings-light.svg" alt="Settings" /> icon in the
        top-right corner of any widget.
      </p>

      <h3>Changing themes</h3>

      <p>
        There are several background themes you can choose from for your
        dashboard. Some are photos, other are solid colors. To pick one, click
        the{' '}
        <button
          type="button"
          disabled
          className="app-header-theme-switcher-button"
        >
          Shore
        </button>{' '}
        icon ("Shore" is the name of whatever current theme). You'll see a
        gallery of themes to choose from. Click one to use it.
      </p>

      <h2>Add Faith Dashboard to your home screen (iOS)</h2>

      <p>
        If you are using an iPhone or iPad, you can visit{' '}
        <span className="landing-page-em">
          <Link href="/">faithdashboard.com</Link>
        </span>{' '}
        and add it to your home screen like so:
      </p>

      <ol>
        <li>
          In the Safari app, tap the Share icon at the bottom of the screen (it
          looks like a square with an up-arrow coming out of it)
        </li>
        <li>
          Scroll down the Share sheet and tap the{' '}
          <span className="landing-page-em">Add to Home Screen</span> button
        </li>
        <li>
          On the next screen, tap the{' '}
          <span className="landing-page-em">Add</span> button
        </li>
      </ol>

      <Image
        src={addToHomeScreenImage1}
        alt="Share Icon"
        className="block-image"
        layout="responsive"
      />
      <Image
        src={addToHomeScreenImage2}
        alt="Share Sheet"
        className="block-image"
        layout="responsive"
      />
      <Image
        src={addToHomeScreenImage3}
        alt="Add to Home Screen"
        className="block-image"
        layout="responsive"
      />

      <h2>Syncing</h2>

      <p>
        If you want to sync your dashboard across all your devices, you'll need
        to <Link href="/sign-up">create an account</Link>. If you already have
        an account, you can click the "Sign Up/In" link in the top-right corner
        of the page, then click the "Sign In" button.
      </p>

      <p>
        All syncing happens in the background as you make changes to your
        dashboard. When you sign out, the app reverts to the out-of-the-box
        dashboard, but don't be alarmed—your dashboard will be waiting for you
        when you sign back in.
      </p>

      <h2>Contact</h2>

      <p>
        If you need any help, please email{' '}
        <a href="mailto:support@faithdashboard.com">
          support@faithdashboard.com
        </a>
        .
      </p>

      <p>This app is dedicated to Christ our Lord.</p>

      <p>
        <LinkButton href="/">Return to App</LinkButton>
      </p>
    </LandingPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pagePath: '/help',
      pageTitle: 'Help | Faith Dashboard',
      pageDescription:
        'Documentation on how to get started with Faith Dashboard, your home for strength and encouragement every day.'
    }
  };
}

export default Help;
