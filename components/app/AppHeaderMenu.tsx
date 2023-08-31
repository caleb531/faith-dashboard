import Button from '@components/reusable/Button';
import Icon from '@components/reusable/Icon';
import { defer } from 'lodash-es';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react';
import { isTruthy } from '../authUtils.client';

type MenuItem = {
  key: string;
  content: string | ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
};

type Props = {
  label: string;
  icon: string;
  items: (MenuItem | null | undefined | false)[];
};

function AppHeaderMenu({ label, icon, items }: Props) {
  const [isShowingMenu, setIsShowingMenu] = useState(false);

  function wrapMenuItemClick(
    event: React.MouseEvent | React.KeyboardEvent,
    onClick: MenuItem['onClick']
  ) {
    event.preventDefault();
    if (onClick) {
      onClick(event);
      setIsShowingMenu(false);
    }
  }

  return (
    <div className="app-header-menu-container">
      <Button
        className="app-header-menu-button"
        onClick={() => setIsShowingMenu(!isShowingMenu)}
      >
        <Icon name={icon} alt={label} />
      </Button>
      {isShowingMenu && (
        <div className="app-header-menu">
          <Button
            data-type="overlay"
            className="app-header-menu-overlay"
            onClick={() => setIsShowingMenu(false)}
            aria-label="Close Menu"
          ></Button>
          <menu className="app-header-menu-list">
            {items.filter(isTruthy).map((item) => {
              return (
                <li className="app-header-menu-list-item" key={item.key}>
                  {item.href ? (
                    <Link href={item.href}>{item.content}</Link>
                  ) : item.onClick ? (
                    <a
                      href="#"
                      onClick={(event) =>
                        wrapMenuItemClick(event, item.onClick)
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          wrapMenuItemClick(event, item.onClick);
                        }
                      }}
                    >
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
