import React from 'react';
import Modal from '../generic/Modal';
import { WidgetType } from '../types.d';
import widgetTypes from '../widgets/widgetTypes';
import AddWidgetEntry from './AddWidgetEntry';

type Props = { onCloseWidgetPicker: () => void };

function AddWidgetPicker({ onCloseWidgetPicker }: Props) {

  return (
    <Modal onCloseModal={onCloseWidgetPicker}>
        <section className="add-widget-picker">
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
        </section>
    </Modal>
  );

}

export default AddWidgetPicker;
