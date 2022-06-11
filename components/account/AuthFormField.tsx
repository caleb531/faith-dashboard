import React, { InputHTMLAttributes, RefObject } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement>

const AuthFormField = React.forwardRef(function AuthFormField(
  props: Props,
  ref: RefObject<HTMLInputElement>
) {
  return (
    <>
      <label
        htmlFor={props.id}
        className="accessibility-only">
        {props.placeholder}
      </label>
      <input className="account-auth-form-input" {...props} ref={ref} />
    </>
  );
});

export default AuthFormField;
