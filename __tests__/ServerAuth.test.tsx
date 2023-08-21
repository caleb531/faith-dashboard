import { POST as SignInPOST } from '@app/auth/sign-in/route';
import { convertObjectToFormData } from '@components/authUtils.client';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import { NextResponse } from 'next/server';
import { NextRequest } from './__mocks__/nextServer';

type HandlerType = (req: NextRequest) => Promise<NextResponse>;

async function postToRouteHandler({
  handler,
  path,
  fields
}: {
  handler: HandlerType;
  path: string;
  fields: object;
}) {
  NextRequest._formData = convertObjectToFormData(fields);
  return handler(
    new NextRequest('http://localhost:3000/auth/sign-in', {
      method: 'POST',
      body: NextRequest._formData
    })
  );
}

describe('server routes', () => {
  it('should include sign in functionality', async () => {
    jest
      .spyOn(supabase.auth, 'signInWithPassword')
      .mockImplementationOnce(async () => {
        return { data: { user: {}, session: {} }, error: null } as any;
      });
    const fields = {
      email: 'caleb@calebevans.me',
      password: 'CorrectHorseBatteryStaple',
      'cf-turnstile-response': 'abc123'
    };
    await postToRouteHandler({
      handler: SignInPOST,
      path: '/auth/sign-in',
      fields
    });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: fields.email,
      password: fields.password,
      options: {
        captchaToken: fields['cf-turnstile-response']
      }
    });
  });
});
