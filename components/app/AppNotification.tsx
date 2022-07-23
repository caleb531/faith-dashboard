import { useEffect, useState } from 'react';
import Modal from '../reusable/Modal';
import getAppNotificationMessage from './getAppNotificationMessage';

// Show a message to the user if the result of clicking a magic link provides
// any feedback (e.g. "Token has expired")
function AppNotification() {
  const [notificationMessage, setNotificationMessage] = useState<string>();

  function onDismissNotification() {
    // If the user reloads the page after dismissing the notification modal, do
    // not show them the same modal again
    window.location.assign('/');
  }

  // Parse possible notification message from URL parameters (which often
  // originate from Supabase)
  useEffect(() => {
    const newNotificationMessage = getAppNotificationMessage();
    if (newNotificationMessage) {
      setNotificationMessage(newNotificationMessage);
    }
  }, []);

  return notificationMessage ? (
    <Modal onCloseModal={onDismissNotification}>
      <p>{notificationMessage}</p>
    </Modal>
  ) : null;
}

export default AppNotification;
