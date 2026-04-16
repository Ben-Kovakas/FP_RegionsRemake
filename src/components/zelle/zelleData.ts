//all made up data so I can populate the zelle menus

export type ZelleContact = {
  id: string;
  name: string;
  handle: string;
  phone: string;
  initials: string;
  note: string;
  favorite?: boolean;
};

export type ZelleTransactionKind = 'paid' | 'received' | 'requested';

export type ZelleTransaction = {
  id: string;
  kind: ZelleTransactionKind;
  contactId: string;
  counterparty: string;
  amount: number;
  date: string;
  note: string;
  status: string;
};

export const zelleAccount = {
  name: 'Alex Carter',
  handle: 'alex.carter@email.com',
  phone: '(312) 555-0108',
};

export const zelleContacts: ZelleContact[] = [
  {
    id: 'maya',
    name: 'Maya Chen',
    handle: 'maya.chen@email.com',
    phone: '(312) 555-0142',
    initials: 'MC',
    note: 'Groceries, brunch, and rides',
    favorite: true,
  },
  {
    id: 'jordan',
    name: 'Jordan Ellis',
    handle: 'jordan.ellis@email.com',
    phone: '(312) 555-0188',
    initials: 'JE',
    note: 'Rent and utilities',
    favorite: true,
  },
  {
    id: 'sophia',
    name: 'Sophia Patel',
    handle: 'sophia.patel@email.com',
    phone: '(773) 555-0199',
    initials: 'SP',
    note: 'Dinner plans',
  },
  {
    id: 'marcus',
    name: 'Marcus Reed',
    handle: 'marcus.reed@email.com',
    phone: '(708) 555-0161',
    initials: 'MR',
    note: 'Concert tickets',
  },
  {
    id: 'elena',
    name: 'Elena Brooks',
    handle: 'elena.brooks@email.com',
    phone: '(847) 555-0116',
    initials: 'EB',
    note: 'Coffee runs',
  },
  {
    id: 'noah',
    name: 'Noah Williams',
    handle: 'noah.williams@email.com',
    phone: '(630) 555-0123',
    initials: 'NW',
    note: 'Weekend trips',
  },
];

export const zelleTransactions: ZelleTransaction[] = [
  {
    id: 'txn-1008',
    kind: 'received',
    contactId: 'maya',
    counterparty: 'Maya Chen',
    amount: 42.75,
    date: 'Today, 9:18 AM',
    note: 'Brunch',
    status: 'Completed',
  },
  {
    id: 'txn-1007',
    kind: 'paid',
    contactId: 'jordan',
    counterparty: 'Jordan Ellis',
    amount: 625,
    date: 'Yesterday, 6:40 PM',
    note: 'Rent share',
    status: 'Completed',
  },
  {
    id: 'txn-1006',
    kind: 'requested',
    contactId: 'sophia',
    counterparty: 'Sophia Patel',
    amount: 31.2,
    date: 'Mar 30',
    note: 'Dinner',
    status: 'Pending',
  },
  {
    id: 'txn-1005',
    kind: 'received',
    contactId: 'marcus',
    counterparty: 'Marcus Reed',
    amount: 84,
    date: 'Mar 27',
    note: 'Tickets',
    status: 'Completed',
  },
  {
    id: 'txn-1004',
    kind: 'paid',
    contactId: 'elena',
    counterparty: 'Elena Brooks',
    amount: 12.5,
    date: 'Mar 24',
    note: 'Coffee',
    status: 'Completed',
  },
  {
    id: 'txn-1003',
    kind: 'received',
    contactId: 'noah',
    counterparty: 'Noah Williams',
    amount: 96.3,
    date: 'Mar 21',
    note: 'Gas and tolls',
    status: 'Completed',
  },
];

export function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function getContactById(contactId: string) {
  return zelleContacts.find((contact) => contact.id === contactId);
}

export function getTransactionById(transactionId: string) {
  return zelleTransactions.find((transaction) => transaction.id === transactionId);
}

export function describeTransaction(transaction: ZelleTransaction) {
  if (transaction.kind === 'paid') {
    return `Paid ${transaction.counterparty}`;
  }

  if (transaction.kind === 'received') {
    return `Received from ${transaction.counterparty}`;
  }

  return `Requested from ${transaction.counterparty}`;
}

export function getSignedAmount(transaction: ZelleTransaction) {
  if (transaction.kind === 'paid') {
    return `-${formatCurrency(transaction.amount)}`;
  }

  if (transaction.kind === 'received') {
    return `+${formatCurrency(transaction.amount)}`;
  }

  return formatCurrency(transaction.amount);
}
