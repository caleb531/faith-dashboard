import { sortBy } from 'lodash-es';
import { AppTheme } from './app.types';

const colorThemeList: AppTheme[] = sortBy(
  [
    {
      name: 'Brown',
      id: 'brown'
    },
    {
      name: 'Green',
      id: 'green'
    },
    {
      name: 'Teal',
      id: 'teal'
    },
    {
      name: 'Blue',
      id: 'blue'
    },
    {
      name: 'Purple',
      id: 'purple'
    },
    {
      name: 'Royal',
      id: 'royal'
    },
    {
      name: 'Rose',
      id: 'rose'
    },
    {
      name: 'Red',
      id: 'red'
    },
    {
      name: 'Orange',
      id: 'orange'
    },
    {
      name: 'Yellow',
      id: 'yellow'
    },
    {
      name: 'Violet',
      id: 'violet'
    }
  ],
  'name'
);

export default colorThemeList;
