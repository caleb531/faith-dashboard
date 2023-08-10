// The contents of a JSX element
export type JSXChildren = JSX.Element | (JSX.Element | null)[] | null;

// A type that represents any JSON-serializable value or structure
export type JSONSerializable =
  | string
  | number
  | boolean
  | JSONSerializable[]
  | object
  | { [key: string]: JSONSerializable }
  | null;

// The props that must be defined for each and every page
export interface PageProps {
  pagePath: string;
  pageTitle: string;
  pageDescription: string;
}
