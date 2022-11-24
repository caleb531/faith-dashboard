import Link from 'next/link';
import { JSXChildren } from '../global';

type Props = {
  href: string;
  className?: string;
  children: JSXChildren | string;
};

function LinkButton({ href, className = '', children }: Props) {
  return (
    <Link href={href} className={`button ${className}`}>
      {children}
    </Link>
  );
}

export default LinkButton;
