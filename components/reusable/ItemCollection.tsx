import classNames from 'classnames';
import React from 'react';

export type Item = { id: string; name: string };

type Props<TItem extends Item> = {
  items: TItem[];
  itemPreview: (item: TItem) => React.ReactNode;
  isCurrentItem: (item: TItem) => boolean;
  onChooseItem: (item: TItem) => void;
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
  onEditItemName,
  onDeleteItem
}: Props<TItem>) => {
  // Since there can be many items, use event delegation to attach only a
  // single listener and figure out which item was clicked
  function chooseItem(event: React.MouseEvent) {
    const target = event.target as HTMLElement;
    const itemElement = target.closest('.item-collection-item');
    console.log(
      'before data-action',
      itemElement,
      target.closest('[data-action="choose-item"]')
    );
    if (!(target.closest('[data-action="choose-item"]') && itemElement)) {
      return;
    }
    console.log('before data-item');
    const newItemId = itemElement.getAttribute('data-item') as Item['id'];
    const newItem = items.find((item) => item.id === newItemId);
    if (!newItem) {
      return;
    }
    onChooseItem(newItem);
  }

  return (
    <ul className="item-collection" onClick={chooseItem}>
      {items.map((item) => {
        return (
          <li
            key={item.id}
            data-item={item.id}
            className={classNames('item-collection-item', {
              'item-collection-item-selected': isCurrentItem(item)
            })}
          >
            {isCurrentItem(item) ? (
              <div className="item-collection-item-selected-icon"></div>
            ) : null}
            <button
              type="button"
              className="item-collection-item-button"
              data-action="choose-item"
              id={`item-${item.id}`}
            >
              <div className="item-collection-item-preview">
                {itemPreview(item)}
              </div>
            </button>
            <label
              className="item-collection-item-label"
              data-action="choose-item"
              htmlFor={`item-${item.id}`}
            >
              {item.name}
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default ItemCollection;
