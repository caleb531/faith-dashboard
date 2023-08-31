import LandingPage from '@components/LandingPage';
import Icon from '@components/reusable/Icon';
import InstructionalButton from '@components/reusable/InstructionalButton';
import LinkButton from '@components/reusable/LinkButton';
import { getPageMetadata } from '@components/seoUtils';
import Image from 'next/image';
import Link from 'next/link';
import addToHomeScreenImage1 from '../../public/images/help/ios-add-to-home-screen-ios-1.jpg';
import addToHomeScreenImage2 from '../../public/images/help/ios-add-to-home-screen-ios-2.jpg';
import addToHomeScreenImage3 from '../../public/images/help/ios-add-to-home-screen-ios-3.jpg';

async function Help() {
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
        <InstructionalButton>
          <Icon name="add-light" alt="Add" />
          <span>Add Widget</span>
        </InstructionalButton>{' '}
        button at the top edge of the app. A panel will appear, allowing you to
        browse for a widget to add.
      </p>
      <p>
        When you've found your desired widget, click the{' '}
        <InstructionalButton>
          <Icon name="add-light" alt="Add" />
          <span>Add Widget</span>
        </InstructionalButton>{' '}
        button next to the widget listing. It will then automatically appear in
        the first column on your dashboard.
      </p>

      <h3>Rearranging widgets</h3>
      <p>
        You can move a widget to a different position or column with the{' '}
        <Icon name="drag-handle-light" alt="Drag" /> icon in the top-left corner
        of any widget.
      </p>

      <h3>Deleting a widget</h3>
      <p>
        You can delete a widget from your dashboard via the{' '}
        <Icon name="remove-light" alt="Remove" /> icon in the top-right corner
        of any widget. This will permanently delete the widget and its contents
        from your dashboard.
      </p>

      <h3>Changing settings</h3>
      <p>
        If you want to change which Bible verse you are displaying or which
        Podcast you are listening to, click the{' '}
        <Icon name="settings-light" alt="Settings" /> icon in the top-right
        corner of any widget.
      </p>

      <h3>Changing themes</h3>
      <p>
        There are several background themes you can choose from for your
        dashboard. Some are photos, other are solid colors. To pick one, click
        the{' '}
        <InstructionalButton>
          <Icon name="paintbrush-light" alt="" />
          <span>Shore</span>
        </InstructionalButton>{' '}
        icon in the top-right corner of the page ("Shore" is the name of
        whatever current theme). You'll see a gallery of themes to choose from.
        Click one to use it.
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
      />
      <Image
        src={addToHomeScreenImage2}
        alt="Share Sheet"
        className="block-image"
      />
      <Image
        src={addToHomeScreenImage3}
        alt="Add to Home Screen"
        className="block-image"
      />

      <h2>Syncing</h2>
      <p>
        If you want to sync your dashboard across all your devices, you'll need
        to <Link href="/sign-up">create an account</Link>. If you already have
        an account, you can <Link href="/sign-in">click here to sign in</Link>.
      </p>
      <p>
        All syncing happens in the background as you make changes to your
        dashboard. When you sign out, the app reverts to the out-of-the-box
        dashboard, but don't be alarmed—your dashboard will be waiting for you
        when you sign back in.
      </p>

      <h2>Managing multiple dashboards</h2>
      <p>
        If you have an account and are signed in, you can have more than one
        dashboard for different purposes! To create, manage, or switch to
        another dashboard, click the{' '}
        <InstructionalButton>
          <Icon name="account-light" alt="Person" />
        </InstructionalButton>{' '}
        button in the top-right corner of the page, then choose "My Dashboards"
        from the menu. You will then be presented with all your dashboards, and
        will see actions for creating, editing, or deleting them.
      </p>

      <h2>Importing / exporting</h2>

      <p>
        Whether or not you have an account, you can export your existing
        dashboard to a file, or import it if you have a file to upload. You can
        accomplish this by clicking the{' '}
        <InstructionalButton>
          <Icon name="account-light" alt="Person" />
        </InstructionalButton>{' '}
        or{' '}
        <InstructionalButton>
          <Icon name="menu-light" alt="Menu" />
        </InstructionalButton>{' '}
        button in the top-right corner of the page, then choosing "Import
        Dashboard" or "Export Dashboard" from the menu.
      </p>

      <p>
        <strong>
          Please note that if you are signed out, importing a dashboard
          overwrite your current dashboard. Only if you are signed in will the
          imported dashboard be added alongside your existing dashboard.
        </strong>
      </p>

      <h2>Account settings</h2>

      <p>
        If you have an account and wish to change details about your account,
        click the{' '}
        <InstructionalButton>
          <Icon name="account-light" alt="Person" />
        </InstructionalButton>{' '}
        button in the top-right corner of the page, then choose "Account
        Settings" from the menu. You will then be redirected to a page where you
        can:
      </p>

      <ul>
        <li>Change your first/last name</li>
        <li>Change your email address</li>
        <li>Change your password</li>
        <li>Request to delete your account by emailing us</li>
      </ul>

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

export function generateMetadata() {
  return getPageMetadata({
    path: '/help',
    title: 'Help | Faith Dashboard',
    description:
      'Documentation on how to get started with Faith Dashboard, your home for strength and encouragement every day.'
  });
}

export default Help;
