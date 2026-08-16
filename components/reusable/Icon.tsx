// Describes the image attributes supported by the shared icon component
type Props = {
  name: string;
  alt?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
};

// Renders an SVG file through the standard image element used by all icons
const Icon = ({ name, alt = '', fetchPriority }: Props) => {
  return (
    <img
      className="icon"
      src={`/icons/${name}.svg`}
      alt={alt}
      draggable="false"
      fetchPriority={fetchPriority}
    />
  );
};

export default Icon;
