import useVerifyCaptcha from '@components/useVerifyCaptcha';
import type { Mock } from 'vitest';

export function mockCaptchaSuccessOnce(token: string) {
  (useVerifyCaptcha as Mock).mockImplementationOnce(() => {
    return [
      () => token,
      () => {
        // noop
      }
    ];
  });
}

export function mockCaptchaFailOnce() {
  (useVerifyCaptcha as Mock).mockImplementationOnce(() => {
    return [
      () => '',
      () => {
        // noop
      }
    ];
  });
}
