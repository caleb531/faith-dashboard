import clsx from 'clsx';
import { AppTheme } from './app.types';

type Props = {
  theme: AppTheme;
};

const ColorThemePreview = ({ theme }: Props) => {
  return <div className={clsx('color-theme-preview', `theme-${theme.id}`)} />;
};

export default ColorThemePreview;
