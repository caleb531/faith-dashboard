import React, { useState, useEffect } from 'react';
import SWUpdateManager from 'sw-update-manager';

function UpdateNotification() {

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (navigator.serviceWorker && window.location.port !== '8080') {
      const serviceWorker = navigator.serviceWorker.register('service-worker.js');
      const updateManager = new SWUpdateManager(serviceWorker);
      updateManager.on('updateAvailable', () => setIsUpdateAvailable(true));
      updateManager.checkForUpdates();
    }
  }, []);

  return (
    <div className={`update-notification ${isUpdateAvailable ? 'update-available' : ''}`}>
      <span className="update-notification-message">Update available! Click here to update.</span>
    </div>
  );

}

export default UpdateNotification;
