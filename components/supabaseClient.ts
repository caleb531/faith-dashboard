// We may eliminate this module in the future since we can just import
// createClientComponentClient directly, but for the time being, this will save
// me from tweaking all of my test files to instantiate the supabase client
// after importing
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();
