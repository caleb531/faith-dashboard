import Link from 'next/link';
import { JSXContents } from '../global';

type Props = {
  href: string;
  className?: string;
  children: JSXContents | string;
};

function LinkButton({
  href,
  className = '',
  children
}: Props) {
  return href && /^https?:/.test(href) ? (
    // Use a native <a> element for external links
    <a
      href={href}
      className={`button ${className}`}>
      {children}
    </a>
  ) : href ? (
    // Use the NextJS <Link> component for internal links
    <Link href={href}>
      <a className={`button ${className}`}>
        {children}
      </a>
    </Link>
  ) : null;
}

export default LinkButton;
