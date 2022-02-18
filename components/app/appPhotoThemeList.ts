import { sortBy } from 'lodash-es';
import { AppThemeListItem } from './app.d';

const photoThemeList: AppThemeListItem[] = sortBy([
  {
    label: 'Word',
    value: 'word'
  },
  {
    label: 'Worship',
    value: 'worship'
  },
  {
    label: 'Grass',
    value: 'grass'
  },
  {
    label: 'Mountain',
    value: 'mountain'
  },
  {
    label: 'Shore',
    value: 'shore'
  }
]);

export default photoThemeList;
