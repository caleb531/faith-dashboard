import { Turnstile } from '@marsidev/react-turnstile';
import React from 'react';

type Props = {
  setCaptchaToken: (token: string) => void;
};

// Memoize Captcha component to ensure that Turnstile script is not loaded more
// than once
const Captcha = React.memo(function Captcha({ setCaptchaToken }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_GOTRUE_SECURITY_CAPTCHA_SITEKEY;

  return siteKey ? (
    <Turnstile
      siteKey={siteKey}
      onSuccess={(token) => setCaptchaToken(token)}
      onExpire={() => {
        console.log('CAPTCHA expired. Resetting...');
        setCaptchaToken('');
        window.turnstile?.reset();
      }}
      onError={() => setCaptchaToken('')}
      options={{ size: 'invisible' }}
    />
  ) : null;
});

export default Captcha;
