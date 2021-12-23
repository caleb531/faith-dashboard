import React from 'react';
import Modal from '../generic/Modal';
import { WidgetType } from '../widgets/widget.d';
import widgetTypes from '../widgets/widgetTypes';
import WidgetPickerEntry from './WidgetPickerEntry';

type Props = { onCloseWidgetPicker: () => void };

function WidgetPicker({ onCloseWidgetPicker }: Props) {

  return (
    <Modal onCloseModal={onCloseWidgetPicker}>
        <section className="widget-picker">
          <h2>Add Widget</h2>
          <ul className="widget-picker-list">
            {widgetTypes.map((widgetType: WidgetType) => {
              return (
                <li className="widget-picker-list-item" key={widgetType.type}>
                  <WidgetPickerEntry widgetType={widgetType} onAddWidget={onCloseWidgetPicker} />
                </li>
              );
            })}
          </ul>
        </section>
    </Modal>
  );

}

export default WidgetPicker;