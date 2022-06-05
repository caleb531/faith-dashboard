import React, { useState } from 'react';
import TutorialStepMessage from '../tutorial/TutorialStepMessage';
import useTutorialStep from '../tutorial/useTutorialStep';
import { AppTheme } from './app.d';
import colorThemeList from './appColorThemeList';
import photoThemeList from './appPhotoThemeList';
import ThemeSwitcher from './ThemeSwitcher';

const allThemes = [...photoThemeList, ...colorThemeList];

type Props = {
  currentTheme: AppTheme
};

function AppHeaderThemeSwitcher({
  currentTheme
}: Props) {

  const { isCurrentStep, stepProps } = useTutorialStep('change-theme');
  const [themeSwitcherIsOpen, setThemeSwitcherIsOpen] = useState(false);

  return (
    <div className="app-header-theme-switcher">
      {isCurrentStep ? <TutorialStepMessage /> : null}
      <label className="theme-switcher-label accessibility-only" htmlFor="app-header-theme-switcher-button">
        Color Theme
      </label>
      <button
        className="app-header-theme-switcher-button app-header-control-button"
        id="app-header-theme-switcher-button"
        onClick={() => setThemeSwitcherIsOpen((isOpen) => !isOpen)}
        {...stepProps}>
        <img
          className="app-header-theme-switcher-button-icon"
          src="/icons/paintbrush-light.svg"
          alt=""
          draggable="false" />
        <span className="app-header-theme-switcher-button-label">
          {allThemes.find((themeListItem) => {
            return themeListItem.value === currentTheme;
          })?.label}
        </span>
      </button>
      {themeSwitcherIsOpen ? (
        <ThemeSwitcher currentTheme={currentTheme} onCloseThemeSwitcher={() => setThemeSwitcherIsOpen(false)} />
      ) : null}
    </div>
  );

}

export default AppHeaderThemeSwitcher;
