import { useId } from 'react';

// The useUniqueFieldId() hook generates an ID for an HTML <input> in a way
// that allows it to be reused for a companion <label> element; this ID is
// guaranteed to be stable, unique across the entire application, and not prone
// to hydration mismatches
export default function useUniqueFieldId(key: string): string {
  const fieldId = `${key}-${useId()}`;
  return fieldId;
}
