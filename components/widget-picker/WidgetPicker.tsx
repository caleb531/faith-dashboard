import Modal from '../reusable/Modal';
import { WidgetType } from '../widgets/widget.types';
import widgetTypes from '../widgets/widgetTypes';
import WidgetPickerEntry from './WidgetPickerEntry';

type Props = {
  onCloseWidgetPicker: () => void;
};

function WidgetPicker({ onCloseWidgetPicker }: Props) {
  return (
    <Modal onClose={onCloseWidgetPicker}>
      <section className="widget-picker">
        <h1>Add Widget</h1>
        <ul className="widget-picker-list">
          {widgetTypes.map((widgetType: WidgetType) => {
            return (
              <li className="widget-picker-list-item" key={widgetType.type}>
                <WidgetPickerEntry
                  widgetType={widgetType}
                  onAddWidget={onCloseWidgetPicker}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </Modal>
  );
}

export default WidgetPicker;
