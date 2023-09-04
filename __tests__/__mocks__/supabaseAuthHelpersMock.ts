import type { Database } from '@components/database.types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export function createClientComponentClient() {
  return supabase;
}
export function createServerComponentClient() {
  return supabase;
}
export function createRouteHandlerClient() {
  return supabase;
}
export function createMiddlewareClient<TDatabase>() {
  return supabase;
}
