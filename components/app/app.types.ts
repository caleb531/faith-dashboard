import { Item } from '@components/reusable/ItemCollection';
import { PostgrestResponse } from '@supabase/supabase-js';
import { WidgetHead } from '../widgets/widget.types';

// An available color theme that can be set by the user to personalize their
// app dashboard
export type AppThemeId = string;

// The state of the application; an instance of
export interface AppState {
  isDefaultApp?: boolean;
  id?: string;
  name?: string;
  theme: AppThemeId;
  shouldShowTutorial?: boolean | undefined;
  widgets: WidgetHead[];
}
export interface SyncedAppState extends AppState {
  id: NonNullable<AppState['id']>;
  name: NonNullable<AppState['name']>;
}

// A dropdown entry for an available app color theme
export interface AppTheme extends Item {
  name: string;
  id: AppThemeId;
}

// The response of any Supabase request
export type SyncResponse =
  | PostgrestResponse<{ raw_data: any }>
  | { error: null };
