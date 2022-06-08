import React, { useEffect, useState } from 'react';
import Modal from '../generic/Modal';

// Show a message to the user if the result of clicking a magic link provides
// any feedback (e.g. "Token has expired")
function AppNotification() {

  const [isNotificationShowing, setIsNotificationShowing] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>();

  function onDismissNotification() {
    setIsNotificationShowing(false);
    // If the user reloads the page after dismissing the notification modal, do
    // not show them the same modal again
    window.location.hash = '';
  }

  // Parse possible notification message from URL parameters (which often
  // originate from Supabase)
  useEffect(() => {
    const urlParams = new URLSearchParams(`?${window.location.hash.slice(1)}`);
    const newNotificationMessage = urlParams.get('message') || urlParams.get('error_description');
    console.log(newNotificationMessage);
    if (newNotificationMessage) {
      setNotificationMessage(newNotificationMessage);
      setIsNotificationShowing(true);
    }
  }, []);

  return isNotificationShowing ? (
    <Modal onCloseModal={onDismissNotification}>
      <p>{notificationMessage}</p>
    </Modal>
  ) : null;
}

export default AppNotification;
