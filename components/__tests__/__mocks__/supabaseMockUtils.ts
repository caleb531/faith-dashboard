import { supabase } from '../../supabaseClient';

// This must always be called BEFORE mockSupabaseSession()
export function mockSupabaseUser(
  user = {
    id: 'b9fa0901-c3d7-4e59-88e6-e483d69e49c4',
    email: 'caleb@example.com',
    user_metadata: { first_name: 'Caleb', last_name: 'Evans' }
  }
) {
  return jest.spyOn(supabase.auth, 'user').mockImplementation(() => {
    return user as any;
  });
}

// This must always be called AFTER mockSupabaseUser()
export function mockSupabaseSession() {
  return jest.spyOn(supabase.auth, 'session').mockImplementation(() => {
    const user = supabase.auth.user();
    return {
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      user
    } as any;
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
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn()
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
    .mockImplementation((tableName: string) => {
      return supabaseFromMocks[tableName] as any;
    }) as any;
}
