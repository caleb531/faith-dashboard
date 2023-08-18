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
    // TODO: There is a problem with the Turnstile <script> loading multiple
    // times due to multiple re-renders; it is also loading quite late, since we
    // have to wait for React to load before we can make the request; consider
    // adopting the vanilla Turnstile implementation instead using Next's
    // <Script /> component in layout.tsx
    <Turnstile
      siteKey={siteKey}
      onSuccess={(token) => setCaptchaToken(token)}
      onExpire={() => setCaptchaToken('')}
      onError={() => setCaptchaToken('')}
      options={{ size: 'invisible' }}
    />
  ) : null;
});

export default Captcha;
