import { WidgetState } from '../widget.types';

export interface NoteWidgetState extends WidgetState {
  text: string;
  fontSize: number;
}
