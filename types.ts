
export enum UserStatus {
  ACTIVE = 'Active',
  BLOCKED = 'Blocked'
}

export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  status: UserStatus;
  vipLevel: number;
  walletBalance: number;
}

export interface RechargeRequest {
  id: string;
  userId: string;
  amount: number;
  paymentChannel: string;
  utrNumber: string;
  dateTime: string;
  status: ApprovalStatus;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  bankDetails: string;
  requestDate: string;
  status: ApprovalStatus;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  dailyIncome: number;
  totalIncome: number;
  duration: number;
  userLimit: number;
  status: 'Active' | 'Disabled';
}

export interface AppSettings {
  commissions: {
    level1: number;
    level2: number;
    level3: number;
  };
  bank: {
    name: string;
    account: string;
    ifsc: string;
    upiId: string;
    qrCodeUrl: string;
  };
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  published: boolean;
}
