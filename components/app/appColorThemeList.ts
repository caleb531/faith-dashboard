import { sortBy } from 'lodash-es';
import { AppThemeListItem } from './app.d';

const colorThemeList: AppThemeListItem[] = sortBy(
  [
    {
      label: 'Brown',
      value: 'brown'
    },
    {
      label: 'Green',
      value: 'green'
    },
    {
      label: 'Teal',
      value: 'teal'
    },
    {
      label: 'Blue',
      value: 'blue'
    },
    {
      label: 'Purple',
      value: 'purple'
    },
    {
      label: 'Royal',
      value: 'royal'
    },
    {
      label: 'Rose',
      value: 'rose'
    },
    {
      label: 'Red',
      value: 'red'
    },
    {
      label: 'Orange',
      value: 'orange'
    },
    {
      label: 'Yellow',
      value: 'yellow'
    },
    {
      label: 'Violet',
      value: 'violet'
    }
  ],
  'label'
);

export default colorThemeList;
