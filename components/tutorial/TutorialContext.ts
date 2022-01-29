import { createContext } from 'react';
import { TutorialContextValue } from './tutorial';

const TutorialContext = createContext<TutorialContextValue>(null);
export default TutorialContext;
