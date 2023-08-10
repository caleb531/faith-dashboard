import { defer } from 'lodash-es';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { isTruthy } from '../accountUtils';

type MenuItem = {
  key: string;
  content: string | ReactNode;
  href?: string;
  onClick?: () => void;
};

type Props = {
  label: string;
  icon: string;
  items: (MenuItem | null | undefined | false)[];
};

function AppHeaderMenu({ label, icon, items }: Props) {
  const [isShowingMenu, setIsShowingMenu] = useState(false);

  function wrapMenuItemClick(onClick: MenuItem['onClick']) {
    if (onClick) {
      onClick();
      setIsShowingMenu(false);
    }
  }

  return (
    <div className="app-header-menu-container">
      <button
        type="button"
        className="app-header-menu-button"
        onClick={() => setIsShowingMenu(!isShowingMenu)}
      >
        <img
          className="app-header-menu-button-icon"
          src={`/icons/${icon}.svg`}
          alt={label}
          draggable="false"
        />
      </button>
      {isShowingMenu && (
        <div className="app-header-menu">
          <div
            className="app-header-menu-overlay"
            onClick={() => setIsShowingMenu(false)}
          ></div>
          <menu className="app-header-menu-list">
            {items.filter(isTruthy).map((item) => {
              return (
                <li className="app-header-menu-list-item" key={item.key}>
                  {item.href ? (
                    <Link href={item.href}>{item.content}</Link>
                  ) : item.onClick ? (
                    <a onClick={() => wrapMenuItemClick(item.onClick)}>
                      {item.content}
                    </a>
                  ) : (
                    // Assuming an element in item.content has its own click
                    // handler, automatically close the menu after it's clicked;
                    // we use lodash's defer() utility to ensure that the
                    // content is not removed from the DOM until any click
                    // listeners in the content have run
                    <div
                      onClick={() =>
                        defer(() => {
                          setIsShowingMenu(false);
                        })
                      }
                    >
                      {item.content}
                    </div>
                  )}
                </li>
              );
            })}
          </menu>
        </div>
      )}
    </div>
  );
}

export default AppHeaderMenu;
