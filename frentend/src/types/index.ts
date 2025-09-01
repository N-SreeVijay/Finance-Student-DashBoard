export interface User {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  course: string;
  semester: string;
  year: string;
  profilePicture?: string;
  branch: string;
  currentSemester: string;
  registrationNo: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountHolderName: string;
  upiId: string;
  upiQrData: string;
}

export interface FeeStructure {
  tuitionFee: number;
  examFee: number;
  otherFee: number;
  insuranceFee: number;
  total: number;
  dueDate: string;
  semester: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'fee' | 'fine' | 'refund';
  reference: string;
  paymentMethod: 'upi' | 'cash' | 'bank_transfer' | 'card';
  semester: string;
  transactionId: string;
  challanNumber: string;
  utrNumber: string;
}

export interface Scholarship {
  id: string;
  studentName: string;
  amount: number;
  concessionPercentage: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
}

export interface ChallanUpload {
  id: string;
  fileName: string;
  uploadDate: string;
  amount: number;
  status: 'verified' | 'pending' | 'rejected';
  transactionId: string;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  totalScore: number;
  highScore: number;
  level: number;
  achievements: number;
  points: number;
  nextLevelPoints: number;
  streak: number;
  badges: string[];
}