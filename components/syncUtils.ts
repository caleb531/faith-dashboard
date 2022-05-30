import { v4 as uuidv4 } from 'uuid';

// Store an identifier in-memory used to uniquely identify this page session,
// which only lasts until the user leaves the page or reloads it; it is stored
// in each Faith Dashboard database entry and is used for ignoring sync pulls
// initiated by sync pushes on this same device
export const pageSessionId: string = uuidv4();
