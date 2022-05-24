import { createContext } from 'react';
import { TutorialContextValue } from './tutorial';

// @ts-ignore
const TutorialContext = createContext<TutorialContextValue>({});
export default TutorialContext;
