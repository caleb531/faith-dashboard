import useVerifyCaptcha from '@components/useVerifyCaptcha';

export function mockCaptchaSuccessOnce(token: string) {
  // TODO: eliminate use of `any`
  (useVerifyCaptcha as any).mockImplementationOnce(() => {
    return [
      () => token,
      () => {
        // noop
      }
    ];
  });
}

export function mockCaptchaFailOnce() {
  (useVerifyCaptcha as any).mockImplementationOnce(() => {
    return [
      () => '',
      () => {
        // noop
      }
    ];
  });
}
