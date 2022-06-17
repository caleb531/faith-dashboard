import { useCallback, useRef } from 'react';

// The useVerifyCaptcha() hook provides stable getter and setter functions for
// managing the Captcha token; the setter function does not trigger a
// re-render, and the hook is agnostic to the Captcha provider that you use
function useVerifyCaptcha(): [
  () => string,
  (token: string) => void
] {

  const tokenRef = useRef('');

  const getCaptchaToken = useCallback(() => {
    return tokenRef.current;
  }, []);
  const setCaptchaToken = useCallback((token) => {
    tokenRef.current = token;
  }, []);

  return [getCaptchaToken, setCaptchaToken];

}

export default useVerifyCaptcha;
