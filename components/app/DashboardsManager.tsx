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
  const { app } = useContext(AppContext);
  const { pullLatestAppFromServer } = useContext(SyncContext);
  const setDashboardSwitchTimeout = useTimeout();
  const supabase = createClientComponentClient();

  const switchToDashboard = async (dashboard: SyncedAppState) => {
    setPendingDashboard(dashboard);
    await pullLatestAppFromServer(dashboard);
    setPendingDashboard(null);
    // Close modal after short delay to give user time to see that the selected
    // dashboard has been changed (since the 'selected' checkmark will now show
    // up over the dashboard they just clicked)
    setDashboardSwitchTimeout(() => {
      onClose();
    }, dashboardChangeDelay);
  };

  const fetchDashboards = useCallback(async () => {
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
        <button className="add-dashboard" type="button">
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
          />
        )}
      </section>
    </Modal>
  );
};

export default DashboardsManager;
