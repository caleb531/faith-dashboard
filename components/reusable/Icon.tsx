type Props = {
  name: string;
  alt?: string;
};

const Icon = ({ name, alt = '' }: Props) => {
  return (
    <img
      className="icon"
      src={`/icons/${name}.svg`}
      alt={alt}
      draggable="false"
    />
  );
};

export default Icon;
