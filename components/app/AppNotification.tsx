import { useEffect, useState } from 'react';
import Modal from '../reusable/Modal';
import getAppNotificationMessage from './getAppNotificationMessage';

// Show a message to the user if the result of clicking a magic link provides
// any feedback (e.g. "Token has expired")
function AppNotification() {
  const [message, setMessage] = useState<string | null>();

  function onDismissNotification() {
    // If the user reloads the page after dismissing the notification modal, do
    // not show them the same modal again
    window.location.hash = '';
    setMessage(null);
  }

  // Parse possible notification message from URL parameters (which often
  // originate from Supabase)
  useEffect(() => {
    const newMessage = getAppNotificationMessage();
    if (newMessage) {
      setMessage(newMessage);
    }
  }, []);

  return message ? (
    <Modal onClose={onDismissNotification}>
      <p className="app-notification-message">{message}</p>
    </Modal>
  ) : null;
}

export default AppNotification;
