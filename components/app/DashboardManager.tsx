import Button from '@components/reusable/Button';
import InlineMessage from '@components/reusable/InlineMessage';
import ItemCollection from '@components/reusable/ItemCollection';
import LoadingIndicator from '@components/reusable/LoadingIndicator';
import Modal from '@components/reusable/Modal';
import useTimeout from '@components/useTimeout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PostgrestError } from '@supabase/supabase-js';
import { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from './AppContext';
import DashboardPreview from './DashboardPreview';
import SessionContext from './SessionContext';
import SyncContext from './SyncContext';
import { SyncedAppState } from './app.types';
import { getDefaultAppState } from './appUtils';

// The number of milliseconds that the Dashboard Manager modal will stay open
// after choosing a dashboard (to give the user time to react to the change)
const dashboardChangeDelay = 500;

type Props = {
  onClose: () => void;
};

const DashboardManager = ({ onClose }: Props) => {
  const [dashboards, setDashboards] = useState<SyncedAppState[]>([]);
  const [dashboardBeingChosen, setDashboardBeingChosen] =
    useState<SyncedAppState | null>(null);
  const [dashboardBeingDeleted, setDashboardBeingDeleted] =
    useState<SyncedAppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<
    Error | PostgrestError | null
  >();
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
          ...getDefaultAppState(),
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

  async function saveEditedDashboardName(dashboard: SyncedAppState) {
    setDashboardError(null);
    const response = await pushLocalAppToServer(dashboard);
    if (response.error) {
      setDashboardError(response.error);
      return;
    }
    setDashboards(updateDashboardInList(dashboards, dashboard));
  }

  async function deleteDashboard(dashboard: SyncedAppState) {
    setDashboardError(null);
    setDashboardBeingDeleted(dashboard);
    const { error } = await supabase
      .from('dashboards')
      .delete()
      .match({
        id: dashboard.id,
        user_id: user?.id
      });
    if (error) {
      setDashboardError(error);
      return;
    }
    const newDashboards = await fetchDashboards();
    setDashboardBeingDeleted(null);
    // Only switch dashboards if the selected dashboard is the dashboard being
    // deleted
    if (newDashboards && newDashboards.length >= 1 && app.id === dashboard.id) {
      await switchToDashboard(newDashboards[0]);
    }
  }

  async function switchToDashboard(
    dashboard: SyncedAppState,
    { autoClose = false }: { autoClose?: boolean } = {}
  ): Promise<void> {
    setDashboardError(null);
    setDashboardBeingChosen(dashboard);
    const response = await pullLatestAppFromServer(dashboard);
    setDashboardBeingChosen(null);
    if (response.error) {
      setDashboardError(response.error);
      return;
    }
    // Close modal after short delay to give user time to see that the selected
    // dashboard has been changed (since the 'selected' checkmark will now show
    // up over the dashboard they just clicked)
    if (autoClose) {
      setDashboardSwitchTimeout(() => {
        onClose();
      }, dashboardChangeDelay);
    }
  }

  const fetchDashboards = useCallback(async (): Promise<
    SyncedAppState[] | undefined
  > => {
    const response = await supabase
      .from('dashboards')
      .select('raw_data')
      .match({ user_id: user?.id })
      .order('updated_at', { ascending: false });
    if (response.error) {
      setDashboardError(response.error);
      setIsLoading(false);
      return;
    }
    if (!(response.data && response.data.length > 0)) {
      setIsLoading(false);
      return;
    }
    const newDashboards = response.data.map((result) => result.raw_data);
    setDashboards(newDashboards);
    setIsLoading(false);
    return newDashboards;
  }, [supabase, user]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  return (
    <Modal onClose={onClose}>
      <section className="dashboard-manager">
        <h1>My Dashboards</h1>
        <p>Here, you can manage and switch between multiple dashboards.</p>
        <Button
          className="add-dashboard"
          disabled={isLoading}
          onClick={addDashboard}
        >
          Add Dashboard
        </Button>
        {dashboardError ? (
          <InlineMessage type="error" message={dashboardError.message} />
        ) : null}
        {isLoading ? (
          <LoadingIndicator className="dashboard-manager-loading-indicator" />
        ) : dashboards.length === 0 ? (
          <p>You have no dashboards. Create one!</p>
        ) : (
          <ItemCollection
            items={dashboards}
            itemType="dashboard"
            onChooseItem={(dashboard) =>
              switchToDashboard(dashboard, { autoClose: true })
            }
            isCurrentItem={(dashboard) => dashboard.id === app.id}
            isItemBeingChosen={(dashboard) =>
              dashboard.id === dashboardBeingChosen?.id
            }
            isItemBeingDeleted={(dashboard) =>
              dashboard.id === dashboardBeingDeleted?.id
            }
            itemPreview={(dashboard) => (
              <DashboardPreview dashboard={dashboard} />
            )}
            onEditItemName={(dashboard) => saveEditedDashboardName(dashboard)}
            onDeleteItem={(dashboard) => {
              const confirmation = confirm(
                `Are you sure you want to permanently delete the dashboard "${dashboard.name}" and all of its widgets?`
              );
              if (!confirmation) {
                return;
              }
              deleteDashboard(dashboard);
            }}
            preventDeletingOnlyItem
          />
        )}
      </section>
    </Modal>
  );
};

export default DashboardManager;
