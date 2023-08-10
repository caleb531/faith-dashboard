import { JSONSerializable } from '../global.types';

export interface Result {
  id: string;
  title: string;
  subtitle: string | null;
  data?: {
    [key: string]: JSONSerializable;
  };
}
