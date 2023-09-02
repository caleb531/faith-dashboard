import useMountListener from '@components/useMountListener';
import Link from 'next/link';
import AppHeaderAddWidgetButton from './AppHeaderAddWidgetButton';
import AppHeaderGlobalMenu from './AppHeaderGlobalMenu';
import AppHeaderThemeSwitcher from './AppHeaderThemeSwitcher';

type Props = {
  canAddWidgets?: boolean;
};

function AppHeader({ canAddWidgets }: Props) {
  const isMounted = useMountListener();
  return (
    <header className="app-header" role="banner">
      <h1 className="app-header-title">
        <Link href="/" className="app-header-title-link">
          Faith Dashboard
        </Link>
      </h1>
      <div className="app-header-controls">
        {isMounted ? (
          <>
            {canAddWidgets ? <AppHeaderAddWidgetButton /> : null}
            <AppHeaderThemeSwitcher />
          </>
        ) : null}
        <AppHeaderGlobalMenu />
      </div>
    </header>
  );
}

export default AppHeader;
