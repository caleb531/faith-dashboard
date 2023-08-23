import classNames from 'classnames';
import { AppTheme } from './app.types';

type Props = {
  theme: AppTheme;
};

const ColorThemePreview = ({ theme }: Props) => {
  return (
    <div className={classNames('color-theme-preview', `theme-${theme.id}`)} />
  );
};

export default ColorThemePreview;
