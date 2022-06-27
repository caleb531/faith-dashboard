import { supabase } from './supabaseClient';
import { getClientId } from './syncUtils';

export async function upsertState<T extends { id?: string }>(state: T) {
  const user = supabase.auth.user();
  if (!user) {
    return;
  }
  return supabase.from('widgets').upsert([
    {
      id: state.id,
      user_id: user.id,
      client_id: getClientId(),
      raw_data: JSON.stringify(state),
      updated_at: new Date().toISOString()
    }
  ]);
}

export async function selectRows(tableName: string) {
  const { data, error } = await supabase.from(tableName).select('raw_data');
  if (!(data && data.length > 0)) {
    return { data: [], error };
  }
  return { data, error };
}

export async function deleteState(tableName: string, stateId: string) {
  const user = supabase.auth.user();
  if (!user) {
    return;
  }
  return supabase.from('widgets').delete().match({
    id: stateId,
    user_id: user.id
  });
}

export default {
  selectRows,
  upsertState,
  deleteState
};
