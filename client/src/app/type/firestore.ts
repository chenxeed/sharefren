import { Bill } from './bill';

export enum CollectionName {
  Bills = 'bills'
}

export interface CollectionBill {
  documentId: string,
  doc: Bill
}