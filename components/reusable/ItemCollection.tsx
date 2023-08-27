import classNames from 'classnames';
import { capitalize } from 'lodash-es';
import React from 'react';
import Button from './Button';
import LoadingIndicator from './LoadingIndicator';

export type Item = { id: string; name: string };

type Props<TItem extends Item> = {
  items: TItem[];
  itemType: string;
  itemPreview: (item: TItem) => React.ReactNode;
  isCurrentItem: (item: TItem) => boolean;
  onChooseItem?: (item: TItem) => void;
  isItemBeingChosen?: (item: TItem) => boolean;
  isItemBeingDeleted?: (item: TItem) => boolean;
  onEditItemName?: (item: TItem) => void;
  onDeleteItem?: (item: TItem) => void;
};

// A collection of items, any of which can be selected and have some arbitrary
// action run against; every item can have a preview of some sort (can be an
// image, element, etc.), but must have a name at a very minimum
const ItemCollection = <TItem extends Item>({
  items,
  itemType,
  itemPreview,
  isCurrentItem,
  onChooseItem,
  isItemBeingChosen,
  isItemBeingDeleted,
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
    const newName = prompt(
      `Please enter a new name for the ${itemType} "${item.name}":`,
      item.name
    );
    if (newName?.trim()) {
      onEditItemName({
        ...item,
        name: newName
      });
    }
  }

  function onDeleteItemWrapper(event: React.MouseEvent) {
    event.preventDefault();
    const item = getItemFromElement(event.target as HTMLElement);
    if (!(item && onDeleteItem)) {
      return;
    }
    onDeleteItem(item);
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
                isItemBeingChosen && isItemBeingChosen(item)
              )
            })}
          >
            {onDeleteItem ? (
              <Button
                className="item-collection-item-delete-button"
                unstyled
                disabled={Boolean(
                  (isItemBeingDeleted && isItemBeingDeleted(item)) ||
                    (isItemBeingChosen && isItemBeingChosen(item))
                )}
                onClick={onDeleteItemWrapper}
              >
                {isItemBeingDeleted && isItemBeingDeleted(item) ? (
                  <LoadingIndicator />
                ) : (
                  <img
                    src="/icons/remove-light.svg"
                    alt={`Delete ${capitalize(itemType)}`}
                    draggable="false"
                  />
                )}
              </Button>
            ) : null}
            <Button
              className="item-collection-item-choose-button"
              data-action="choose-item"
              unstyled
              disabled={Boolean(isItemBeingChosen && isItemBeingChosen(item))}
              aria-labelledby={`item-${item.id}-label`}
              onClick={onChooseItemWrapper}
            >
              <div className="item-collection-item-preview">
                {isItemBeingChosen && isItemBeingChosen(item) ? (
                  <LoadingIndicator
                    className="item-collection-item-loading-indicator"
                    autoCenter
                  />
                ) : isCurrentItem(item) ? (
                  <div className="item-collection-item-selected-icon"></div>
                ) : null}
                {itemPreview(item)}
              </div>
            </Button>
            <span className="item-collection-item-name-area">
              <span
                className="item-collection-item-label"
                data-action="choose-item"
                id={`item-${item.id}-label`}
              >
                <span className="item-collection-item-name">{item.name}</span>
                {onEditItemName ? (
                  <Button
                    className="edit-item-name-button"
                    unstyled
                    onClick={onEditItemNameWrapper}
                  >
                    <img
                      src="/icons/edit-dark.svg"
                      alt={`Edit ${capitalize(itemType)} Name`}
                      draggable="false"
                    />
                  </Button>
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
