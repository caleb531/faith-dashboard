import { WidgetHead } from '../widgets/widget.d';

// An available color theme that can be set by the user to personalize their
// app dashboard
export type AppTheme = 'brown' | 'green' | 'teal' | 'blue' | 'purple' | 'royal' | 'rose' | 'red' | 'orange' | 'yellow' | 'violet' | 'word' | 'worship' | 'pasture' | 'mountain' | 'shore' | 'stars';

// The state of the application; an instance of
export interface AppState {
  theme: AppTheme;
  shouldShowTutorial?: boolean | undefined;
  widgets: WidgetHead[];
}

// A dropdown entry for an available app color theme
interface AppThemeListItem {
  label: string;
  value: AppTheme;
}
