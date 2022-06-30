import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import { AppTheme, AppThemeListItem } from './app.d';

type Props = {
  themeList: AppThemeListItem[];
  themeType: 'photo' | 'color';
  onChooseTheme: (newTheme: AppTheme) => any;
  currentTheme: AppTheme;
};

function ThemeSwitcherList({
  themeList,
  themeType,
  onChooseTheme,
  currentTheme
}: Props) {
  // Since there can be many themes, use event delegation to attach only a
  // single listener and figure out which theme was clicked
  function selectTheme(event: React.MouseEvent) {
    const target = event.target as HTMLUListElement;
    const themeElement = target.closest('.theme-switcher-theme');
    if (target.closest('[data-action="change-theme"]') && themeElement) {
      const newTheme = themeElement.getAttribute('data-theme') as AppTheme;
      onChooseTheme(newTheme);
    }
  }

  return (
    <ul
      className={classNames(
        'theme-switcher-themes',
        `theme-switcher-${themeType}-themes`
      )}
      onClick={selectTheme}
    >
      {themeList.map((themeListItem) => {
        return (
          <li
            key={themeListItem.value}
            data-theme={themeListItem.value}
            className={classNames(
              'theme-switcher-theme',
              `theme-switcher-${themeType}-theme`,
              {
                'theme-switcher-theme-selected':
                  themeListItem.value === currentTheme
              }
            )}
          >
            <button
              type="button"
              className="theme-switcher-theme-button"
              data-action="change-theme"
              id={`theme-${themeListItem.value}`}
            >
              {themeListItem.value === currentTheme ? (
                <div className="theme-switcher-theme-selected-icon"></div>
              ) : null}
              {themeType === 'photo' ? (
                <div className="theme-switcher-photo-theme-photo-container">
                  <Image
                    className="theme-switcher-theme-visual theme-switcher-photo-theme-photo"
                    src={`/images/background-photos/${themeListItem.value}.jpg`}
                    alt=""
                    aria-labelledby={`theme-${themeListItem.value}`}
                    width="200"
                    height="100"
                    draggable="false"
                  />
                </div>
              ) : themeType === 'color' ? (
                <div
                  className={classNames(
                    'theme-switcher-theme-visual',
                    'theme-switcher-color-theme-swatch',
                    `theme-${themeListItem.value}`
                  )}
                />
              ) : null}
            </button>
            <label
              className="theme-switcher-label"
              data-action="change-theme"
              htmlFor={`theme-${themeListItem.value}`}
            >
              {themeListItem.label}
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export default ThemeSwitcherList;
