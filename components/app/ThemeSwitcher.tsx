import { sortBy } from 'lodash-es';
import React, { useContext } from 'react';
import TutorialMessage from '../tutorial/TutorialMessage';
import useTutorialStep from '../tutorial/useTutorialStep';
import { AppTheme, AppThemeListItem } from './app.d';
import AppContext from './AppContext';

const themeList: AppThemeListItem[] = sortBy([
  {
    label: 'Brown',
    value: 'brown'
  },
  {
    label: 'Green',
    value: 'green'
  },
  {
    label: 'Teal',
    value: 'teal'
  },
  {
    label: 'Blue',
    value: 'blue'
  },
  {
    label: 'Purple',
    value: 'purple'
  },
  {
    label: 'Rose',
    value: 'rose'
  },
  {
    label: 'Orange',
    value: 'orange'
  },
  {
    label: 'Yellow',
    value: 'yellow'
  },
  {
    label: 'Violet',
    value: 'violet'
  }
], 'label');

type Props = { theme: AppTheme };

function ThemeSwitcher({ theme }: Props) {

  const dispatchToApp = useContext(AppContext);
  const { isCurrentStep, stepProps } = useTutorialStep('change-theme');

  return (
    <div className="theme-switcher">
      {isCurrentStep ? <TutorialMessage /> : null}
      <label className="theme-switcher-label accessibility-only" htmlFor="theme-switcher-dropdown">
        Color Theme
      </label>
      <select className="theme-switcher-dropdown" id="theme-switcher-dropdown" value={theme} onChange={(event) => dispatchToApp({ type: 'changeTheme', payload: event.target.value as AppTheme })} {...stepProps}>
        <optgroup label="Color Theme">
          {themeList.map((themeListItem) => {
            return (<option value={themeListItem.value} key={themeListItem.value}>
              {themeListItem.label}
            </option>);
          })}
        </optgroup>
      </select>
    </div>
  );

}

export default ThemeSwitcher;
