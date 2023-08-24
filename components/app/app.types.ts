import { Item } from '@components/reusable/ItemCollection';
import { WidgetHead } from '../widgets/widget.types';

// An available color theme that can be set by the user to personalize their
// app dashboard
export type AppThemeId = string;

// The state of the application; an instance of
export interface AppState {
  id?: string;
  name?: string;
  theme: AppThemeId;
  shouldShowTutorial?: boolean | undefined;
  widgets: WidgetHead[];
}

// A dropdown entry for an available app color theme
export interface AppTheme extends Item {
  name: string;
  id: AppThemeId;
}
