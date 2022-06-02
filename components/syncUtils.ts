import { v4 as uuidv4 } from 'uuid';

const clientIdStorageKey = 'faith-dashboard-clientid';

// Generate and store an identifier used to uniquely identify the user's
// browser; this client identifier will be persisted locally across sessions
function getClientId() {
  if (typeof localStorage !== 'undefined') {
    let newClientId = localStorage.getItem(clientIdStorageKey);
    if (!newClientId) {
      newClientId = uuidv4();
      localStorage.setItem(clientIdStorageKey, newClientId);
    }
    return newClientId;
  } else {
    return uuidv4();
  }
}
export const clientId: string = getClientId();
