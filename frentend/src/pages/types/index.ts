export interface Student {
  id: string;
  name: string;
  registrationNo: string;
  course: string;
  branch: string;
  mobile: string;
  email: string;
  admissionYear: string;
  currentSemester: number;
}

export interface FeeStructure {
  tuitionFee: number;
  examFee: number;
  otherFee: number;
  insuranceFee: number;
  total: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'upi' | 'phonepe';
export type TransactionStatus = 'paid' | 'pending' | 'failed' | 'processing';

export interface Transaction {
  id: string;
  paymentMethod: PaymentMethod;
  challanNumber?: string; // For cash payments
  utrNumber?: string; // For bank transfers
  transactionId?: string; // For UPI/PhonePe
  amount: number;
  date: string;
  status: TransactionStatus;
  semester: string;
  paymentMode: string;
  receiptUrl?: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
}

export interface ChallanData {
  challanNumber: string;
  amount: number;
  date: string;
  registrationNo: string;
  studentName: string;
}

export interface UPITransaction {
  transactionId: string;
  amount: number;
  date: string;
  upiId?: string;
  merchantName?: string;
}

export interface BankTransfer {
  utrNumber: string;
  amount: number;
  date: string;
  fromBank: string;
  toBank: string;
}

export interface Scholarship {
  id: string;
  studentName: string;
  bankDetails: BankDetails;
  amount: number;
  concessionPercentage: number;
  status: 'applied' | 'approved' | 'rejected';
  appliedDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'success' | 'warning' | 'info';
  date: string;
  read: boolean;
}

export interface GameStats {
  level: number;
  points: number;
  streak: number;
  badges: string[];
  nextLevelPoints: number;
}