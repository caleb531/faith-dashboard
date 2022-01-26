import { createContext } from 'react';
import { GettingStartedContextValue } from './gettingStarted';

const GettingStartedContext = createContext<GettingStartedContextValue>(null);
export default GettingStartedContext;
