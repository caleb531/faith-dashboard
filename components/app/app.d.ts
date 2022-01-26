import { WidgetHead } from '../widgets/widget.d';

// An available color theme that can be set by the user to personalize their
// app dashboard
export type AppTheme = 'brown' | 'green' | 'teal' | 'blue' | 'purple' | 'rose';

// The state of the application; an instance of
export interface AppState {
  theme: AppTheme;
  shouldShowGettingStarted?: boolean;
  widgets: WidgetHead[];
}

// A dropdown entry for an available app color theme
interface AppThemeListItem {
  label: string;
  value: AppTheme;
}
