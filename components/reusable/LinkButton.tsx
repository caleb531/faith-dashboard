import Link from 'next/link';
import React from 'react';

type Props = {
  href: string;
  className?: string;
  unstyled?: boolean;
  children: React.ReactNode | string;
};

function LinkButton({
  href,
  className = '',
  unstyled = false,
  children
}: Props) {
  return (
    <Link
      href={href}
      className={`button ${className}`}
      data-unstyled={unstyled}
    >
      {children}
    </Link>
  );
}

export default LinkButton;
