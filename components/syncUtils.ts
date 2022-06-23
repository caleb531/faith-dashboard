import { v4 as uuidv4 } from 'uuid';

// An identifier used to uniquely identify the user's browser; this client
// identifier will be persisted locally across sessions; the below variable
// will be populated when getClientId() is run
let clientId: string | null = null;
// The localStorage key to use for persisting
const clientIdStorageKey = 'faith-dashboard-clientid';

// Generate and store the client ID if has not already been generated
export function getClientId() {
  if (clientId) {
    return clientId;
  } else if (typeof localStorage !== 'undefined') {
    clientId = localStorage.getItem(clientIdStorageKey);
    if (!clientId) {
      clientId = uuidv4();
      localStorage.setItem(clientIdStorageKey, clientId);
    }
    return clientId;
  } else {
    clientId = uuidv4();
    return clientId;
  }
}
