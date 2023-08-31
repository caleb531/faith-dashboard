import React from 'react';

export type Props = {
  children?: React.ReactNode;
  unstyled?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({ children, unstyled, ...rest }: Props) => {
  return (
    <button type="button" data-unstyled={unstyled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
