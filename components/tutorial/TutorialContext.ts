import { createContext } from 'react';
import { TutorialContextValue } from './tutorial.types';

// @ts-ignore
const TutorialContext = createContext<TutorialContextValue>({});
export default TutorialContext;
