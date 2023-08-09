import { v4 as uuidv4 } from 'uuid';
import {
  getClientIdStorageKey,
  getSelectedAppIdStorageKey
} from './storageUtils';

// An identifier used to uniquely identify the user's browser; this client
// identifier will be persisted locally across sessions; the below variable
// will be populated when getClientId() is run
let clientId: string | null = null;

// Retrieve the ID of the selected app/dashboard at any time for the purposes of
// data sync
export function getSelectedAppId() {
  if (typeof localStorage !== 'undefined') {
    return JSON.parse(
      String(localStorage.getItem(getSelectedAppIdStorageKey()))
    );
  } else {
    return null;
  }
}

// Generate and store the client ID if has not already been generated
export function getClientId() {
  /* istanbul ignore else */
  if (clientId) {
    return clientId;
  } else if (typeof localStorage !== 'undefined') {
    clientId = localStorage.getItem(getClientIdStorageKey());
    if (!clientId) {
      clientId = uuidv4();
      localStorage.setItem(getClientIdStorageKey(), clientId);
    }
    return clientId;
  } else {
    // This 'else' clause is only for completeness, since localStorage does not
    // exist in an SSR context where the app can be run; however, in practice,
    // the getClientId() function only runs if the user is signed in, which
    // will never occur in an SSR context; so technically, the below statement
    // will never actually run, in our case
    clientId = uuidv4();
    return clientId;
  }
}
