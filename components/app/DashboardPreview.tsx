import { columnCount } from '@components/widgets/WidgetBoard';
import widgetTypes from '@components/widgets/widgetTypes';
import { fromPairs, groupBy, times } from 'lodash-es';
import Image from 'next/image';
import { useMemo } from 'react';
import { AppState } from './app.types';

const iconNamesByWidgetType = fromPairs(
  widgetTypes.map((widget) => {
    return [widget.type, widget.icon];
  })
);

type Props = {
  dashboard: AppState;
};

const DashboardPreview = ({ dashboard }: Props) => {
  const widgetsByColumn = useMemo(() => {
    return groupBy(dashboard.widgets, 'column');
  }, [dashboard.widgets]);

  return (
    <div className="dashboard-preview">
      <Image
        src={`/images/background-photos/${dashboard.theme}.jpg`}
        alt=""
        fill
        sizes="200px"
        draggable="false"
      />
      <div className="dashboard-preview-columns">
        {times(columnCount, (c) => {
          return (
            <div key={`column-${c}`} className="dashboard-preview-column">
              {widgetsByColumn[c + 1]?.map((widget) => {
                return (
                  <div
                    key={widget.id}
                    data-type={widget.type}
                    className="dashboard-preview-widget"
                  >
                    <img
                      src={`/icons/${iconNamesByWidgetType[widget.type]}.svg`}
                      // It could be information overload for a screen reader to
                      // read the name of every widget in each dashboard
                      alt=""
                      className="dashboard-preview-widget-icon"
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPreview;
