type Props = {
  children: JSX.Element;
  href: string;
};

// By mocking next/link, we disable NextJS's prefetching mechanism and
// therefore quell an intermittent act() error that was causing my tests to
// sometimes fail
function LinkMock({ children, href }: Props) {
  return <a {...children.props} href={href} />;
}

export default LinkMock;