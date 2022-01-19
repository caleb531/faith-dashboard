import { createContext, Dispatch } from 'react';
import { AppAction } from './AppReducer';

const AppContext = createContext<Dispatch<AppAction>>(null);
export default AppContext;
