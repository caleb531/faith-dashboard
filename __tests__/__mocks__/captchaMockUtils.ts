const useVerifyCaptcha = vi.fn();

export function mockCaptchaSuccessOnce(token: string) {
  useVerifyCaptcha.mockImplementation(() => {
    return [
      () => console.log('run with token', token) || token,
      () => {
        // noop
      }
    ];
  });
}

export function mockCaptchaFailOnce() {
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
