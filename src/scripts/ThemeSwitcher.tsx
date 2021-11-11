import React, { useContext } from 'react';
import { AppContext } from './AppContext';

function ThemeSwitcher(props) {

  const { app, dispatchApp } = useContext(AppContext);

  return (
    <select className="theme-switcher" value={app.theme} onChange={(event) => dispatchApp({type: 'change-theme', payload: event.target.value})}>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
    </select>
  );

}

export default ThemeSwitcher;
