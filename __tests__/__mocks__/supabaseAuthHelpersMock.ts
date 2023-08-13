import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../components/databaseSchema.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export function createClientComponentClient() {
  return supabase;
}
export function createServerComponentClient() {
  return supabase;
}
