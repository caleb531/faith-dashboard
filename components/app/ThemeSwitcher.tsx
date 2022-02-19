import classNames from 'classnames';
import React from 'react';
import Modal from '../generic/Modal';
import { AppTheme } from './app.d';
import colorThemeList from './appColorThemeList';
import photoThemeList from './appPhotoThemeList';

type Props = { currentTheme: AppTheme, onCloseThemeSwitcher: () => void };

function ThemeSwitcher({ currentTheme, onCloseThemeSwitcher }: Props) {

  return (
    <Modal onCloseModal={onCloseThemeSwitcher}>
        <section className="theme-switcher">
          <h1>Choose Theme</h1>
          <p>Click a theme to use it for your dashboard!</p>
          <ul className="theme-switcher-list theme-switcher-photo-themes">
            {photoThemeList.map((themeListItem) => {
              return (
                <li key={themeListItem.value} className="theme-switcher-list-item theme-switcher-photo-theme">

                </li>
              );
            })}
          </ul>
          <ul className="theme-switcher-list theme-switcher-color-themes">
            {colorThemeList.map((themeListItem) => {
              return (
                <li key={themeListItem.value} className="theme-switcher-list-item theme-switcher-color-theme">
                  <div className={classNames(
                    'theme-switcher-color-theme-swatch',
                    `theme-${themeListItem.value}`
                  )}></div>
                  <span className="theme-switcher-color-theme-label">{themeListItem.label}</span>
                </li>
              );
            })}
          </ul>
        </section>
    </Modal>
  );

}

export default ThemeSwitcher;
