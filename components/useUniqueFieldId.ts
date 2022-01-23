import { uniqueId } from 'lodash-es';
import { useState } from 'react';

// The useUniqueFieldId() generates an ID for an HTML <input> in a way that
// allows it to be reused for a companion <label> element; this ID is
// guaranteed to be unique across the entire application
export default function useUniqueFieldId(key: string): string {

  const [fieldId, setFieldId] = useState(() => uniqueId(`${key}-`));

  return fieldId;

}
