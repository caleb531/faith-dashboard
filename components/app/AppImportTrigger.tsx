import React from 'react';

type Props = {
  inputId: string;
  children: React.ReactNode;
};

const AppImportTrigger = ({ inputId, children }: Props) => {
  return <label htmlFor={inputId}>{children}</label>;
};

export default AppImportTrigger;
