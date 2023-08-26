import ItemCollection from '@components/reusable/ItemCollection';
import LoadingIndicator from '@components/reusable/LoadingIndicator';
import Modal from '@components/reusable/Modal';
import useTimeout from '@components/useTimeout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from './AppContext';
import DashboardPreview from './DashboardPreview';
import SessionContext from './SessionContext';
import SyncContext from './SyncContext';
import { SyncedAppState } from './app.types';
import appStateDefault from './appStateDefault';

// The number of milliseconds that the Dashboard Manager modal will stay open
// after choosing a dashboard (to give the user time to react to the change)
const dashboardChangeDelay = 500;

type Props = {
  onClose: () => void;
};

const DashboardsManager = ({ onClose }: Props) => {
  const [dashboards, setDashboards] = useState<SyncedAppState[]>([]);
  const [pendingDashboard, setPendingDashboard] =
    useState<SyncedAppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(SessionContext);
  const { app, dispatchToApp } = useContext(AppContext);
  const { pullLatestAppFromServer, pushLocalAppToServer } =
    useContext(SyncContext);
  const setDashboardSwitchTimeout = useTimeout();
  const supabase = createClientComponentClient();

  function addDashboard() {
    const name = prompt('Please enter a name for your new dashboard:');
    if (name?.trim()) {
      dispatchToApp({
        type: 'replaceApp',
        payload: {
          ...appStateDefault,
          name,
          shouldShowTutorial: false
        }
      });
      onClose();
    }
  }

  function updateDashboardInList(
    dashboards: SyncedAppState[],
    newDashboard: SyncedAppState
  ): SyncedAppState[] {
    const dashboardIndex = dashboards.findIndex((dashboard) => {
      return dashboard.id === newDashboard.id;
    });
    if (dashboardIndex === -1) {
      return dashboards;
    }
    const newDashboards = dashboards.slice(0);
    newDashboards.splice(dashboardIndex, 1, newDashboard);
    return newDashboards;
  }

  async function switchToDashboard(dashboard: SyncedAppState): Promise<void> {
    setPendingDashboard(dashboard);
    await pullLatestAppFromServer(dashboard);
    setPendingDashboard(null);
    // Close modal after short delay to give user time to see that the selected
    // dashboard has been changed (since the 'selected' checkmark will now show
    // up over the dashboard they just clicked)
    setDashboardSwitchTimeout(() => {
      onClose();
    }, dashboardChangeDelay);
  }

  const fetchDashboards = useCallback(async (): Promise<void> => {
    if (!user) {
      return;
    }
    const { data, error } = await supabase
      .from('dashboards')
      .select('raw_data')
      .match({ user_id: user.id })
      .order('updated_at', { ascending: false });
    if (!(data && data.length > 0)) {
      return;
    }
    setDashboards(data.map((result) => result.raw_data));
    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  return (
    <Modal onClose={onClose}>
      <section className="dashboards-manager">
        <h1>My Dashboards</h1>
        <p>Here, you can manage and switch between multiple dashboards.</p>
        <button className="add-dashboard" type="button" onClick={addDashboard}>
          Add Dashboard
        </button>
        {isLoading ? (
          <LoadingIndicator className="dashboards-manager-loading-indicator" />
        ) : dashboards.length === 0 ? (
          <p>You have no dashboards. Create one!</p>
        ) : (
          <ItemCollection
            items={dashboards}
            onChooseItem={(dashboard) => switchToDashboard(dashboard)}
            isCurrentItem={(dashboard) => dashboard.id === app.id}
            isItemLoading={(dashboard) => dashboard.id === pendingDashboard?.id}
            itemPreview={(dashboard) => (
              <DashboardPreview dashboard={dashboard} />
            )}
            onEditItemName={(dashboard) => {
              setDashboards(updateDashboardInList(dashboards, dashboard));
              pushLocalAppToServer(dashboard);
            }}
          />
        )}
      </section>
    </Modal>
  );
};

export default DashboardsManager;
