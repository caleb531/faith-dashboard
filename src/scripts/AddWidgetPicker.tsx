import React from 'react';
import Modal from './Modal';
import AddWidgetEntry from './AddWidgetEntry';
import widgetTypes from '../data/widgetTypes';
import { WidgetType } from './types';

function AddWidgetPicker({ onCloseWidgetPicker }: { onCloseWidgetPicker: Function }) {

  return (
    <Modal onCloseModal={onCloseWidgetPicker}>
        <div className="add-widget-picker">
          <h2>Add Widget</h2>
          <ul className="add-widget-type-list">
            {widgetTypes.map((widgetType: WidgetType) => {
              return (
                <li className="add-widget-type-list-item" key={widgetType.type}>
                  <AddWidgetEntry widgetType={widgetType} onAddWidget={onCloseWidgetPicker} />
                </li>
              );
            })}
          </ul>
        </div>
    </Modal>
  );

}

export default AddWidgetPicker;
