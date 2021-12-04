import { WidgetState } from '../../types';

export interface NoteWidgetState extends WidgetState {
  text: string;
  fontSize: number;
}
