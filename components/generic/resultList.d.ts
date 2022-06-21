import { JSONSerializable } from '../global.d';

export interface Result {
  id: string;
  title: string;
  subtitle: string | null;
  data?: {
    [key: string]: JSONSerializable;
  };
}
