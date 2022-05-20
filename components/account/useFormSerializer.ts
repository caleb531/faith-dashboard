// The useFormSerializer() hook returns a helper function to serialize a <form>
// element's fields into a single JSON object
function useFormSerializer() {
  function serializeForm(form: HTMLFormElement) {
    const formData = new FormData(form);
    const fields: { [key: string]: string } = {};
    return Array.from(formData).reduce((fields, [key, value]) => {
      fields[key] = value as string;
      return fields;
    }, fields);
  }
  return [serializeForm];
}

export default useFormSerializer;
