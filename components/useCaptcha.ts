import HCaptcha from '@hcaptcha/react-hcaptcha';
import { RefObject, useCallback, useRef } from 'react';

// The response object provided when executing the captcha
type ExecuteResponse = { response: string, key: string };

// The useCaptcha() hook provides stable getter and setter functions for
// managing the Captcha token; the setter function does not trigger a
// re-render, and the hook is agnostic to the Captcha provider that you use
function useCaptcha(): [
  RefObject<HCaptcha>,
  () => Promise<ExecuteResponse>
] {

  const captchaRef = useRef<HCaptcha>(null);

  const executeCaptcha = useCallback(() => {
    if (captchaRef.current) {
      return captchaRef.current?.execute({ async: true });
    } else {
      return Promise.resolve({ response: '', key: '' });
    }
  }, []);

  return [captchaRef, executeCaptcha];

}

export default useCaptcha;
