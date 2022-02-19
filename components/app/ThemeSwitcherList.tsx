import classNames from 'classnames';
import Image from 'next/image';
import React, { useContext } from 'react';
import { AppTheme, AppThemeListItem } from './app.d';
import AppContext from './AppContext';

type Props = {
  themeList: AppThemeListItem[],
  themeType: 'photo' | 'color',
  onChooseTheme: (newTheme: AppTheme) => any
};

function ThemeSwitcherList({ themeList, themeType, onChooseTheme }: Props) {

  const dispatchToApp = useContext(AppContext);

  // Since there can be many themes, use event delegation to attach only a
  // single listener and figure out which theme was clicked
  function selectTheme(event: React.MouseEvent) {
    const target = event.target as HTMLUListElement;
    const themeElement = target.closest('.theme-switcher-theme');
    if (target.closest('.theme-switcher-theme-target') && themeElement) {
      const newTheme = themeElement.getAttribute('data-theme') as AppTheme;
      dispatchToApp({ type: 'changeTheme', payload: newTheme });
      onChooseTheme(newTheme);
    }
  }

  return (
    <ul
      className={classNames(
        'theme-switcher-themes',
        `theme-switcher-${themeType}-themes`
      )}
      onClick={selectTheme}>
      {themeList.map((themeListItem) => {
        return (
          <li
          key={themeListItem.value}
          data-theme={themeListItem.value}
          className={classNames(
            'theme-switcher-theme',
            `theme-switcher-${themeType}-theme`
          )}>
          <div className="theme-switcher-theme-target">
            {themeType === 'photo' ? (
              <div className="theme-switcher-photo-theme-photo-container">
                <Image
                  className="theme-switcher-photo-theme-photo"
                  src={`/images/background-photos/${themeListItem.value}.jpg`}
                  alt=""
                  aria-labelledby={`theme-${themeListItem.value}`}
                  width="200"
                  height="100"
                  draggable="false" />
              </div>
            ) : themeType === 'color' ? (
              <div className={classNames(
                'theme-switcher-color-theme-swatch',
                `theme-${themeListItem.value}`
              )} />
            ) : null}
          </div>
          <span
            className="theme-switcher-label"
            id={`${themeListItem.label}`}>
            {themeListItem.label}
          </span>
          </li>
        );
      })}
    </ul>
  );
}

export default ThemeSwitcherList;
