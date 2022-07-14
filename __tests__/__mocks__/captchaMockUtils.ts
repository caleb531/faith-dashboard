import useVerifyCaptcha from '../../components/useVerifyCaptcha';

export function mockCaptchaSuccessOnce(token: string) {
  (useVerifyCaptcha as jest.Mock).mockImplementationOnce(() => {
    return [
      () => token,
      () => {
        // noop
      }
    ];
  });
}

export function mockCaptchaFailOnce() {
  (useVerifyCaptcha as jest.Mock).mockImplementationOnce(() => {
    return [
      () => '',
      () => {
        // noop
      }
    ];
  });
}
