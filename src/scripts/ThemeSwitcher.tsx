import React, { useContext, useReducer } from 'react';

function ThemeSwitcher(props) {

  return (
    <select className="theme-switcher" onChange={(event) => props.dispatchApp({type: 'change-theme', payload: event.target.value})}>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
    </select>
  );

}

export default ThemeSwitcher;
