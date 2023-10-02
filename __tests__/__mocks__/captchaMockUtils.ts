const useVerifyCaptcha = vi.fn();

export function mockCaptchaSuccessOnce(token: string) {
  useVerifyCaptcha.mockImplementationOnce(() => {
    return [
      () => token,
      () => {
        // noop
      }
    ];
  });
}

export function mockCaptchaFailOnce() {
  useVerifyCaptcha.mockImplementationOnce(() => {
    return [
      () => '',
      () => {
        // noop
      }
    ];
  });
}

export default useVerifyCaptcha;
