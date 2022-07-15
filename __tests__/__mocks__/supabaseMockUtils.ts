import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../components/supabaseClient';

// This must always be called BEFORE mockSupabaseSession()
export function mockSupabaseUser(
  user: Partial<User> | null = {
    id: 'b9fa0901-c3d7-4e59-88e6-e483d69e49c4',
    email: 'caleb@example.com',
    user_metadata: { first_name: 'Caleb', last_name: 'Evans' }
  }
) {
  return jest.spyOn(supabase.auth, 'user').mockImplementation(() => {
    return user as User | null;
  });
}

// This must always be called AFTER mockSupabaseUser()
export function mockSupabaseSession(
  session: Partial<Session> | null = {
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    user: supabase.auth.user()
  }
) {
  return jest.spyOn(supabase.auth, 'session').mockImplementation(() => {
    return session as Session | null;
  });
}

export function mockSupabaseApiResponse(
  supabaseObject: any,
  methodName: string,
  {
    user,
    session,
    error
  }: {
    user: object | null;
    session: object | null;
    error: object | null;
  }
) {
  return jest.spyOn(supabaseObject, methodName).mockImplementation(() => {
    return {
      user,
      session: session
        ? {
            expires_in: 3600,
            expires_at: Date.now() / 1000 + 3600,
            user,
            ...session
          }
        : null,
      error
    } as any;
  });
}

// Generate a separate set of supabase database operation mocks for each table
// name we might try to access; this gives us more granular control and allows
// us to independently manage select() mocks
function generateSupabaseFromMocks(tableName: string) {
  return {
    select: jest.fn().mockName(`${tableName} select`),
    insert: jest.fn().mockName(`${tableName} insert`),
    update: jest.fn().mockName(`${tableName} update`),
    upsert: jest.fn().mockName(`${tableName} upsert`),
    delete: jest.fn().mockName(`${tableName} delete`)
  };
}

export const supabaseFromMocks: {
  [key: string]: { [key: string]: jest.Mock };
} = {
  dashboards: generateSupabaseFromMocks('dashboards'),
  widgets: generateSupabaseFromMocks('widgets')
};

// Mocks supabase select(), insert(), update(), upsert(), and delete()
export function mockSupabaseFrom() {
  return jest
    .spyOn(supabase, 'from')
    .mockName('supabase from')
    .mockImplementation((tableName: string) => {
      return supabaseFromMocks[tableName] as any;
    }) as any;
}