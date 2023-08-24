import Image from 'next/image';
import { AppState } from './app.types';

type Props = {
  dashboard: AppState;
};

const DashboardPreview = ({ dashboard }: Props) => {
  return (
    <div className="dashboards-manager-dashboard-mask">
      <Image
        src={`/images/background-photos/${dashboard.theme}.jpg`}
        alt=""
        fill
        sizes="200px"
      />
    </div>
  );
};

export default DashboardPreview;
