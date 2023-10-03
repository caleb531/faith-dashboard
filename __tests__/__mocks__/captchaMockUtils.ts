let captchToken = '';

export function mockCaptchaSuccess(token: string) {
  captchToken = token;
}

export function mockCaptchaFail() {
  captchToken = '';
}

export default function useVerifyCaptcha() {
  return [
    () => captchToken,
    () => {
      // noop
    }
  ];
}
