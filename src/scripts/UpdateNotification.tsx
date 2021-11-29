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
    <div className="update-notification">

    </div>
  );

}

export default UpdateNotification;
