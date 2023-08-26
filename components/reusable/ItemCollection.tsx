import classNames from 'classnames';
import React from 'react';
import LoadingIndicator from './LoadingIndicator';

export type Item = { id: string; name: string };

type Props<TItem extends Item> = {
  items: TItem[];
  itemPreview: (item: TItem) => React.ReactNode;
  isCurrentItem: (item: TItem) => boolean;
  onChooseItem?: (item: TItem) => void;
  isItemLoading?: (item: TItem) => boolean;
  onEditItemName?: (item: TItem) => void;
  onDeleteItem?: (item: TItem) => void;
};

// A collection of items, any of which can be selected and have some arbitrary
// action run against; every item can have a preview of some sort (can be an
// image, element, etc.), but must have a name at a very minimum
const ItemCollection = <TItem extends Item>({
  items,
  itemPreview,
  isCurrentItem,
  onChooseItem,
  isItemLoading,
  onEditItemName,
  onDeleteItem
}: Props<TItem>) => {
  // Retrieve the Item object corresponding to the given DOM element
  function getItemFromElement(element: HTMLElement): TItem | undefined {
    const itemElement = element.closest('.item-collection-item');
    if (!itemElement) {
      return;
    }
    const newItemId = itemElement.getAttribute('data-item') as Item['id'];
    return items.find((item) => item.id === newItemId);
  }

  // Since there can be many items, use event delegation to attach only a
  // single listener and figure out which item was clicked
  function onChooseItemWrapper(event: React.MouseEvent) {
    const item = getItemFromElement(event.target as HTMLElement);
    if (!(item && onChooseItem)) {
      return;
    }
    onChooseItem(item);
  }

  function onEditItemNameWrapper(event: React.MouseEvent) {
    event.preventDefault();
    const item = getItemFromElement(event.target as HTMLElement);
    if (!(item && onEditItemName)) {
      return;
    }
    onEditItemName({
      ...item,
      name: prompt(`Please enter a new name for "${item.name}"`, item.name)
    });
  }

  return (
    <ul className="item-collection">
      {items.map((item) => {
        return (
          <li
            key={item.id}
            data-item={item.id}
            className={classNames('item-collection-item', {
              'item-collection-item-selected': isCurrentItem(item),
              'item-collection-item-loading': Boolean(
                isItemLoading && isItemLoading(item)
              )
            })}
          >
            {isCurrentItem(item) ? (
              <div className="item-collection-item-selected-icon"></div>
            ) : isItemLoading && isItemLoading(item) ? (
              <LoadingIndicator
                className="item-collection-item-loading-indicator"
                autoCenter
              />
            ) : null}
            <button
              type="button"
              className="item-collection-item-button"
              data-action="choose-item"
              aria-labelledby={`item-${item.id}-label`}
              onClick={onChooseItemWrapper}
            >
              <div className="item-collection-item-preview">
                {itemPreview(item)}
              </div>
            </button>
            <span className="item-collection-item-name-area">
              <span
                className="item-collection-item-label"
                data-action="choose-item"
                id={`item-${item.id}-label`}
              >
                <span className="item-collection-item-name">{item.name}</span>
                {onEditItemName ? (
                  <button
                    type="button"
                    className="edit-item-name-button"
                    data-unstyled
                    onClick={onEditItemNameWrapper}
                  >
                    <img
                      src="/icons/edit-dark.svg"
                      alt="Edit Dashboard Name"
                      draggable="false"
                    />
                  </button>
                ) : null}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default ItemCollection;
