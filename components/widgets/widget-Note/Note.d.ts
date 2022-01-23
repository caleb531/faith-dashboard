import { WidgetState } from '../widget.d';

export interface NoteWidgetState extends WidgetState {
  text: string;
  fontSize: number;
}
