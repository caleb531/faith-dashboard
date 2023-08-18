import { Turnstile } from '@marsidev/react-turnstile';

type Props = {
  setCaptchaToken: (token: string) => void;
};

function Captcha({ setCaptchaToken }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_GOTRUE_SECURITY_CAPTCHA_SITEKEY;

  return siteKey ? (
    <Turnstile
      siteKey={siteKey}
      onSuccess={(token) => setCaptchaToken(token)}
      onExpire={() => setCaptchaToken('')}
      onError={() => setCaptchaToken('')}
      options={{ size: 'invisible' }}
    />
  ) : null;
}

export default Captcha;
