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
    label: 'Forest',
    value: 'forest'
  },
  {
    label: 'Mountains',
    value: 'mountain'
  },
  {
    label: 'Shore',
    value: 'shore'
  },
  {
    label: 'Stars',
    value: 'stars'
  },
  {
    label: 'Pasture',
    value: 'pasture'
  }
]);

export default photoThemeList;
