// The serializeForm() function serializes a <form> element's fields into a
// JSON object
function serializeForm(form: HTMLFormElement) {
  const formData = new FormData(form);
  const fields: Record<string, string> = {};
  return Array.from(formData).reduce((fields, [key, value]) => {
    fields[key] = value as string;
    return fields;
  }, fields);
}

export default serializeForm;
