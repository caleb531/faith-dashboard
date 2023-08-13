import Link from 'next/link';
import React from 'react';

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode | string;
};

function LinkButton({ href, className = '', children }: Props) {
  return (
    <Link href={href} className={`button ${className}`}>
      {children}
    </Link>
  );
}

export default LinkButton;
