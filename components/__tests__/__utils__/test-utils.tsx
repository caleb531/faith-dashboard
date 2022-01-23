import { v4 as uuidv4 } from 'uuid';
import { WidgetHead } from '../../widgets/widget.d';

export function createWidget(props: object): WidgetHead {
  return {
      id: uuidv4(),
      type: null,
      column: null,
    ...props
  };
}
