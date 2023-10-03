const useVerifyCaptcha = vi.fn();

export function mockCaptchaSuccess(token: string) {
  useVerifyCaptcha.mockImplementation(() => {
    return [
      () => token,
      () => {
        // noop
      }
    ];
  });
}

export function mockCaptchaFail() {
  useVerifyCaptcha.mockImplementation(() => {
    return [
      () => '',
      () => {
        // noop
      }
    ];
  });
}

export default useVerifyCaptcha;
