import { SocialUser } from 'angularx-social-login';

export interface Bill {
  name: string;
  friends: Friend[];
  items: Item[];
  payers: Payer[];
  debts: Debt[];
  userId: SocialUser['id'];
  created: number;
  updated: number;
}

export interface Friend {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  sharer_ids: Friend['id'][];
}

export interface Payer {
  id: string;
  payerId: Friend['id'];
  payment: number;
}

export interface Debt {
  owerId: Friend['id'];
  amount: number;
  settled: boolean;
}
