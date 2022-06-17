import HCaptcha from '@hcaptcha/react-hcaptcha';
import React from 'react';

type Props = {};

const Captcha = React.forwardRef(function Captcha({}: Props, ref: any) {

  const sitekey = process.env.NEXT_PUBLIC_GOTRUE_SECURITY_CAPTCHA_SITEKEY;

  return sitekey ? (
    <HCaptcha
      size="invisible"
      sitekey={sitekey}
      onVerify={() => {/* noop */}}
      ref={ref}
      />
  ) : null;
});

export default Captcha;
