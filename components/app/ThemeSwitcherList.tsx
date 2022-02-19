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
    const themeElement = target.closest('.theme-switcher-list-item');
    if (themeElement) {
      const newTheme = themeElement.getAttribute('data-theme') as AppTheme;
      dispatchToApp({ type: 'changeTheme', payload: newTheme });
      onChooseTheme(newTheme);
    }
  }

  return (
    <ul
      className="theme-switcher-list theme-switcher-photo-themes"
      onClick={selectTheme}>
      {themeList.map((themeListItem) => {
        return (
          <li
          key={themeListItem.value}
          data-theme={themeListItem.value}
          className="theme-switcher-list-item theme-switcher-photo-theme">
          {themeType === 'photo' ? (
            <div className="theme-switcher-photo-theme-photo-container">
              <Image
                className="theme-switcher-photo-theme-photo"
                src={`/images/background-photos/${themeListItem.value}.jpg`}
                alt=""
                width="200"
                height="100" />
            </div>
          ) : themeType === 'color' ? (
            <div className={classNames(
              'theme-switcher-color-theme-swatch',
              `theme-${themeListItem.value}`
            )}></div>
          ) : null}
          <span className="theme-switcher-label">{themeListItem.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default ThemeSwitcherList;
