import LoadingIndicator from '@components/reusable/LoadingIndicator';
import Modal from '@components/reusable/Modal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { capitalize } from 'lodash-es';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from './AppContext';
import SessionContext from './SessionContext';
import { AppState } from './app.types';

type Props = {
  onClose: () => void;
};

const DashboardsManager = ({ onClose }: Props) => {
  const [dashboards, setDashboards] = useState<AppState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(SessionContext);
  const { app } = useContext(AppContext);
  const supabase = createClientComponentClient();

  const fetchDashboards = useCallback(async () => {
    if (!user) {
      return;
    }
    const { data, error } = await supabase
      .from('dashboards')
      .select('raw_data')
      .match({ user_id: user.id });
    if (!(data && data.length > 0)) {
      return;
    }
    setDashboards(data.map((result) => JSON.parse(String(result.raw_data))));
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
          <LoadingIndicator />
        ) : dashboards.length === 0 ? (
          <p>You have no dashboards. Create one!</p>
        ) : (
          <ul className="dashboards-manager-dashboards">
            {dashboards.map((dashboard: AppState) => {
              return (
                <li key={dashboard.id} className="dashboards-manager-dashboard">
                  <button
                    type="button"
                    className="dashboards-manager-dashboard-button"
                    data-action="change-dashboard"
                    id={`dashboard-${dashboard.id}`}
                  >
                    <div className="dashboards-manager-dashboard-mask">
                      {dashboard.id === app.id ? (
                        <div className="dashboards-manager-dashboard-selected-icon"></div>
                      ) : null}
                      <Image
                        src={`/images/background-photos/${dashboard.theme}.jpg`}
                        alt=""
                        fill
                      />
                    </div>
                  </button>
                  <label
                    className="dashboards-manager-dashboard-label"
                    data-action="change-dashboard"
                    htmlFor={`dashboard-${dashboard.id}`}
                  >
                    {capitalize(dashboard.theme)}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Modal>
  );
};

export default DashboardsManager;
