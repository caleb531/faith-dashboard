import { getUser } from '@components/authUtils.client';
import { Session, User, UserResponse } from '@supabase/supabase-js';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';

// This must always be called BEFORE await mockSupabaseSession()
export async function mockSupabaseUser(
  user: Partial<User> | null = {
    id: 'b9fa0901-c3d7-4e59-88e6-e483d69e49c4',
    email: 'caleb@example.com',
    user_metadata: { first_name: 'Caleb', last_name: 'Evans' }
  }
) {
  return jest.spyOn(supabase.auth, 'getUser').mockImplementation(async () => {
    if (user) {
      return {
        data: { user },
        error: null
      } as UserResponse;
    } else {
      return {
        data: { user: null },
        error: new Error('User signed out')
      } as UserResponse;
    }
  });
}

// This must always be called AFTER mockSupabaseUser()
export async function mockSupabaseSession(
  session: Partial<Session> | null = {
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600
  }
) {
  const user = await getUser();
  if (session && user) {
    session.user = user;
  }
  return jest
    .spyOn(supabase.auth, 'getSession')
    .mockImplementation(async () => {
      if (session) {
        return {
          data: { session, __mock: true } as { session: Session },
          error: null
        };
      } else {
        return {
          data: { session: null, __mock: true },
          error: null
        };
      }
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
  [key: string]: Record<string, jest.Mock>;
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

// The default response of any Supabase call that writes to the database (i.e.
// upsert and delete)
async function getDefaultWriteResponse() {
  return {
    user: await getUser(),
    session: supabase.auth.getSession(),
    error: null
  };
}

export type TableName = 'dashboards' | 'widgets';

// The supabase.from().select() method returns a promise which also has .order()
// and .where() methods, which also (respectively) return promises; therefore,
// to mock this correctly and in a way where TypeScript won't complain, we must
// subclass the native Promise class
export class SupabaseSelectPromise<T> extends Promise<T> {
  constructor(callback: ConstructorParameters<typeof Promise<T>>[0]) {
    super(callback);
  }
  order?: jest.Mock;
  match?: jest.Mock;
  limit?: jest.Mock;
}

function getPostgresBuilderMock(
  mockMethodName: 'mockImplementation' | 'mockImplementationOnce',
  tableName: TableName,
  response: any
) {
  const promise = new SupabaseSelectPromise((resolve) => {
    resolve(response);
  });
  /* eslint-disable no-unexpected-multiline */
  promise.order = jest
    // Because we are attaching additional members to the Promise object, it is
    // essential that the mockImplementation() callbacks NOT be async functions,
    // since an async function will return a native Promise wrapped around our
    // modified promise object (which defeats the whole purpose); in other
    // words, we must return our modified promise object directly
    .fn()
    .mockName(`${tableName} order`)
    [mockMethodName](() =>
      getPostgresBuilderMock(mockMethodName, tableName, response)
    );
  promise.match = jest
    .fn()
    .mockName(`${tableName} match`)
    [mockMethodName](() =>
      getPostgresBuilderMock(mockMethodName, tableName, response)
    );
  promise.limit = jest
    .fn()
    .mockName(`${tableName} limit`)
    [mockMethodName](() =>
      getPostgresBuilderMock(mockMethodName, tableName, response)
    );
  /* eslint-enable no-unexpected-multiline */
  return promise;
}

export function mockSupabaseSelect(tableName: TableName, response: any) {
  const mockMethodName = 'mockImplementation';
  supabaseFromMocks[tableName].select[mockMethodName](() => {
    return getPostgresBuilderMock(mockMethodName, tableName, response);
  });
  return supabaseFromMocks[tableName].select;
}
export function mockSupabaseSelectOnce(tableName: TableName, response: any) {
  const mockMethodName = 'mockImplementationOnce';
  supabaseFromMocks[tableName].select[mockMethodName](() => {
    return getPostgresBuilderMock(mockMethodName, tableName, response);
  });
  return supabaseFromMocks[tableName].select;
}

export function mockSupabaseUpsert(tableName: TableName) {
  supabaseFromMocks[tableName].upsert.mockImplementation(async () => {
    return getDefaultWriteResponse();
  });
  return supabaseFromMocks[tableName].upsert;
}

export function mockSupabaseDelete(tableName: TableName) {
  supabaseFromMocks[tableName].delete.mockImplementation(() => {
    return {
      match: jest.fn().mockImplementation(async () => {
        return getDefaultWriteResponse();
      })
    };
  });
  return supabaseFromMocks[tableName].delete;
}
