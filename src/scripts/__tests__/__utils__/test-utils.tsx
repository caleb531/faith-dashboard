import { v4 as uuidv4 } from 'uuid';
import { WidgetState } from '../../types.d';

export function createWidget(props: object): WidgetState {
  return {
      id: uuidv4(),
      type: null,
      isSettingsOpen: false,
      column: null,
      height: null,
      data: {},
    ...props
  };
}
