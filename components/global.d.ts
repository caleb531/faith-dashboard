// The contents of a JSX element
export type JSXChildren = JSX.Element | (JSX.Element | null)[] | null;

// A type that represents any JSON-serializable value or structure
export type JSONSerializable =
  | string
  | number
  | boolean
  | Array<JSONSerializable>
  | object
  | { [key: string]: JSONSerializable }
  | null;

// The props that must be defined for each and every page
interface PageProps {
  pagePath: string;
  pageTitle: string;
  pageDescription: string;
}
