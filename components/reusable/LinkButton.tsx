import Link from 'next/link';
import { JSXContents } from '../global';

type Props = {
  href: string;
  className?: string;
  children: JSXContents | string;
};

function LinkButton({ href, className = '', children }: Props) {
  return (
    <Link href={href}>
      <a className={`button ${className}`}>{children}</a>
    </Link>
  );
}

export default LinkButton;
