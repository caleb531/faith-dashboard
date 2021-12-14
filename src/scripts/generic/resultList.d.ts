import { JSONSerializable } from '../types';

export interface Result {
  id: string;
  title: string;
  subtitle: string;
  data?: {
    [key: string]: JSONSerializable
  };
}
