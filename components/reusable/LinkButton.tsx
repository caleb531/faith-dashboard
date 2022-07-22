import Link from 'next/link';
import { JSXChildren } from '../global';

type Props = {
  href: string;
  className?: string;
  children: JSXChildren | string;
};

function LinkButton({ href, className = '', children }: Props) {
  return (
    <Link href={href}>
      <a className={`button ${className}`}>{children}</a>
    </Link>
  );
}

export default LinkButton;
