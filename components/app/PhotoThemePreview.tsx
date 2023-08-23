import Image from 'next/image';
import { AppTheme } from './app.types';

type Props = {
  theme: AppTheme;
};

const PhotoThemePreview = ({ theme }: Props) => {
  return (
    <Image
      className="photo-theme-preview"
      src={`/images/background-photos/${theme.id}.jpg`}
      alt=""
      width="200"
      height="100"
      draggable="false"
    />
  );
};

export default PhotoThemePreview;
