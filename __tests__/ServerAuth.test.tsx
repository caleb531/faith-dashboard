import { POST as SignInPOST } from '@app/auth/sign-in/route';
import { convertObjectToFormData } from '@components/authUtils.client';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import { NextRequest } from './__mocks__/nextServer';

describe('server routes', () => {
  it('should include sign in functionality', async () => {
    jest
      .spyOn(supabase.auth, 'signInWithPassword')
      .mockImplementationOnce(async () => {
        return { data: { user: {}, session: {} }, error: null } as any;
      });
    NextRequest._formData = convertObjectToFormData({
      email: 'caleb@calebevans.me',
      password: 'CorrectHorseBatteryStaple',
      'cf-turnstile-response': 'abc123'
    });
    await SignInPOST(
      new NextRequest('http://localhost:3000/auth/sign-in', {
        method: 'POST',
        body: NextRequest._formData
      })
    );
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'caleb@calebevans.me',
      password: 'CorrectHorseBatteryStaple',
      options: {
        captchaToken: 'abc123'
      }
    });
  });
});
