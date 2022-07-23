// The getAppNotificationMessage() function retrieves the notification message
// on the URL of the current page, if present; this message can either be
// informational or related to a specific error
function getAppNotificationMessage() {
  const urlParams = new URLSearchParams(`${window.location.hash.slice(1)}`);
  const notificationMessage =
    urlParams.get('message') || urlParams.get('error_description');
  return notificationMessage;
}

export default getAppNotificationMessage;
