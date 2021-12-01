import React, { useState, useEffect } from 'react';
import { Workbox, messageSW } from 'workbox-window';
import { StateAction } from '../types.d';

function UpdateNotification() {

  const [availableUpdate, setAvailableUpdate] = useState(null);
  const [wb, setWb] = useState(() => new Workbox('service-worker.js'));

  // Update mechanism code borrowed from
  // <https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users>
  function initialize() {
    function showSkipWaitingPrompt(waitingEvent: object) {
      // `waitingEvent.wasWaitingBeforeRegister` will be false if this is
      // the first time the updated service worker is waiting.
      // When `waitingEvent.wasWaitingBeforeRegister` is true, a previously
      // updated service worker is still waiting.
      // You may want to customize the UI prompt accordingly.
      setAvailableUpdate(waitingEvent);
    }
    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener('waiting', showSkipWaitingPrompt);
    // wb.addEventListener('externalwaiting', showSkipWaitingPrompt);
    wb.register();
  }

  // Update the service worker and reload the page
  function update() {
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    wb.addEventListener('controlling', () => {
      window.location.reload();
    });
    // Send a message to the waiting service worker instructing
    // it to skip waiting, which will trigger the `controlling`
    // event listener above.
    // Note: for this to work, you have to add a message
    // listener in your service worker. See below.
    if (availableUpdate) {
      messageSW(availableUpdate.sw, { type: 'SKIP_WAITING' });
    }
  }

  // Initialize service worker when component is first loaded
  useEffect(() => initialize(), []);

  return (
    <div className={`update-notification ${availableUpdate ? 'update-available' : ''}`} onClick={() => update()}>
      <span className="update-notification-message">Update available! Click here to update.</span>
    </div>
  );

}

export default UpdateNotification;
