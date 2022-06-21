import HCaptcha from '@hcaptcha/react-hcaptcha';

if (!process.env.NEXT_PUBLIC_GOTRUE_SECURITY_CAPTCHA_SITEKEY) {
  throw new Error(
    'NEXT_PUBLIC_GOTRUE_SECURITY_CAPTCHA_SITEKEY environment variable missing'
  );
}

type Props = {
  setCaptchaToken: (token: string) => void;
};

function Captcha({ setCaptchaToken }: Props) {
  const sitekey = process.env.NEXT_PUBLIC_GOTRUE_SECURITY_CAPTCHA_SITEKEY;

  return sitekey ? (
    <HCaptcha sitekey={sitekey} onVerify={setCaptchaToken} />
  ) : null;
}

export default Captcha;
