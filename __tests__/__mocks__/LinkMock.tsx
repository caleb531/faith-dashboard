import React from 'react';

type Props = {
  children: React.ReactNode;
  href: string;
};

// By mocking next/link, we disable NextJS's prefetching mechanism and
// therefore quell an intermittent act() error that was causing my tests to
// sometimes fail
function LinkMock({ children, ...props }: Props) {
  return <a {...props}>{children}</a>;
}

export default LinkMock;
