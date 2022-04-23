
// A type that represents any JSON-serializable value or structure
export type JSONSerializable = string | number | boolean | Array<JSONSerializable> | object | { [key: string]: JSONSerializable } | null;

// The action object for any reducer within the application
export interface StateAction {
  type: string;
  payload?: JSONSerializable;
}
