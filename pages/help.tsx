import React from 'react';

function Help() {
  return (
    <div className="help landing-page">
      <p><a href="../">Return to App</a></p>

      <h1>Help | Faith Dashboard</h1>

      <p>Faith Dashboard is <strong>your one place for anything and everything that inspires your faith.</strong> It&apos;s a private board for your favorite Bible verses, sermons, and anything you&apos;d like. Come back to it whenever you need encouragement, wisdom, or simple truth.</p>

      <h2>What can I do?</h2>

      <p>When you load the app for the first time, you&apos;ll see a three-column
      view with a few &quot;widgets&quot; for you to try. These widgets let you do things like:</p>

      <ul>
      <li>Display your favorite Bible verses</li>
      <li>Listen to your favorite faith podcast</li>
      <li>Jot down anything you&apos;d like!</li>
      </ul>

      <h3>Add new widget</h3>

      <p>You can add a new widget by clicking the <button type="button" disabled className="add-widget-button"><img src="/icons/add-light.svg" alt="" /> Add Widget</button> button at the top edge of the app. A panel will appear, allowing you to browse for a widget to add.</p>

      <p>When you&apos;ve found your desired widget, click the <button type="button" disabled className="add-widget-button"><img src="/icons/add-light.svg" alt="" /> Add Widget</button> next to the widget listing. It will then automatically appear in the first column on your dashboard.</p>

      <h3>Rearranging widgets</h3>

      <p>You can move a widget to a different position or column with the <img src="/icons/drag-handle-light.svg" alt="Drag" /> icon in the top-left corner of any widget.</p>

      <h3>Deleting a widget</h3>

      <p>You can delete a widget from your dashboard via the <img src="/icons/remove-light.svg" alt="Remove" /> icon in the top-right corner of any widget. This will permanently delete the widget and its contents from your dashboard.</p>

      <h3>Changing settings</h3>

      <p>If you want to change which Bible verse you are displaying or which Podcast you are listening to, click the <img src="/icons/settings-light.svg" alt="Settings" /> icon in the top-right corner of any widget.</p>

      <h2>Add to your home screen (iOS)</h2>

      <p>If you are using an iPhone or iPad, you can visit <a href="https://faithdashboard.com"><strong>faithdashboard.com</strong></a> and add it to your home screen like so:</p>

      <ol>
      <li>In the Safari app, tap the Share icon at the bottom of the screen (it looks like a square with an up-arrow coming out of it)</li>
      <li>Scroll down the Share sheet and tap the <strong>Add to Home Screen</strong> button</li>
      <li>On the next screen, tap the <strong>Add</strong> button</li>
      </ol>

      <img src="/images/help/ios-add-to-home-screen-ios-1.jpg" alt="Share Icon" className="block-image" />
      <img src="/images/help/ios-add-to-home-screen-ios-2.jpg" alt="Share Sheet" className="block-image" />
      <img src="/images/help/ios-add-to-home-screen-ios-3.jpg" alt="Add to Home Screen" className="block-image" />

      <h2>Contact</h2>

      <p>If you need any help, please reach out to me (Caleb) at <a href="https://calebevans.me/contact/" rel="noopener">my personal website</a>.</p>

      <p>This app is dedicated to Christ our Lord.</p>

      <p><a href="../">Return to App</a></p>
    </div>
  );
}
export default Help;
