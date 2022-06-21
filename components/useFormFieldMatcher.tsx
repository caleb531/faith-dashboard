import React, { RefObject, useCallback, useRef } from 'react';

type Params = {
  mismatchMessage: string;
};

type MatcherChangeCallback = (event: React.FormEvent<HTMLInputElement>) => void;

// The useFormFieldMatcher() hook is
function useFormFieldMatcher({ mismatchMessage }: Params): [
  {
    ref: RefObject<HTMLInputElement>;
    onChange: MatcherChangeCallback;
  },
  {
    ref: RefObject<HTMLInputElement>;
    onChange: MatcherChangeCallback;
  }
] {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  const checkForFieldMatch = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const firstInput = firstInputRef.current;
      const secondInput = secondInputRef.current;
      if (
        !(firstInput && secondInput && firstInput.value && secondInput.value)
      ) {
        return;
      }
      if (secondInput.value !== firstInput.value) {
        secondInput.setCustomValidity(mismatchMessage);
      } else {
        secondInput.setCustomValidity('');
      }
    },
    [mismatchMessage]
  );

  return [
    {
      ref: firstInputRef,
      onChange: checkForFieldMatch
    },
    {
      ref: secondInputRef,
      onChange: checkForFieldMatch
    }
  ];
}

export default useFormFieldMatcher;
