
// A type that represents any JSON-serializable value or structure
export type JSONSerializable = string | number | boolean | Array<JSONSerializable> | object | { [key: string]: JSONSerializable } | null;
