export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  registrationNumber: 'REG2024001',
  course: 'Computer Science Engineering',
  semester: 'Semester 6',
  year: '2024-25',
  profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  branch: 'Computer Science',
  currentSemester: 'Semester 6',
  registrationNo: 'REG2024001'
};

// Alias for backward compatibility
export const mockStudent = mockUser;

export const mockBankDetails = {
  bankName: 'State Bank of India',
  accountNumber: '1234567890123456',
  ifscCode: 'SBIN0001234',
  branch: 'University Campus Branch',
  accountHolderName: 'ABC University',
  upiId: '8985400242@ibl',
  upiQrData: 'upi://pay?pa=8985400242@ibl&pn=ABC%20University&cu=INR'
};


export const mockFeeStructure = {
  tuitionFee: 45000,
  examFee: 2500,
  otherFee: 3500,
  insuranceFee: 1000,
  total: 52000,
  dueDate: '2024-03-15',
  semester: 'Spring 2024'
};

export const mockGameStats = {
  gamesPlayed: 25,
  wins: 18,
  losses: 7,
  winRate: 72,
  totalScore: 15420,
  highScore: 2850,
  level: 12,
  achievements: 8,
  points: 1250,
  nextLevelPoints: 1500,
  streak: 5,
  badges: ['Early Bird', 'Perfect Payment', 'Streak Master']
};

export const mockTransactions = [
  {
    id: '1',
    date: '2024-02-15',
    description: 'Semester Fee Payment',
    amount: 52000,
    status: 'completed' as const,
    type: 'fee' as const,
    reference: 'TXN123456789',
    paymentMethod: 'upi' as const,
    semester: 'Spring 2024',
    transactionId: 'UPI123456789',
    challanNumber: 'CH123456789',
    utrNumber: 'UTR123456789'
  },
  {
    id: '2',
    date: '2024-01-20',
    description: 'Library Fine',
    amount: 150,
    status: 'completed' as const,
    type: 'fine' as const,
    reference: 'TXN123456788',
    paymentMethod: 'cash' as const,
    semester: 'Spring 2024',
    transactionId: 'CASH123456788',
    challanNumber: 'CH123456788',
    utrNumber: 'UTR123456788'
  },
  {
    id: '3',
    date: '2024-01-10',
    description: 'Hostel Fee',
    amount: 25000,
    status: 'pending' as const,
    type: 'fee' as const,
    reference: 'TXN123456787',
    paymentMethod: 'bank_transfer' as const,
    semester: 'Spring 2024',
    transactionId: 'BANK123456787',
    challanNumber: 'CH123456787',
    utrNumber: 'UTR123456787'
  }
];

// Mock OCR processing functions
export const mockOCRProcess = async (file: File) => {
  // Simulate OCR processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    challanNumber: 'CH' + Math.random().toString().substr(2, 8),
    amount: 52000,
    date: new Date().toISOString().split('T')[0],
    registrationNo: 'REG2024001',
    studentName: 'John Doe'
  };
};

export const mockUPIOCRProcess = async (file: File) => {
  // Simulate UPI OCR processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    transactionId: 'UPI' + Math.random().toString().substr(2, 10),
    amount: 52000,
    date: new Date().toISOString().split('T')[0],
    upiId: 'user@phonepe',
    merchantName: 'ABC University'
  };
};

// Validation functions
export const validateUTRFormat = (utr: string): boolean => {
  // UTR format validation - typically 12 digits
  const utrRegex = /^\d{12}$/;
  return utrRegex.test(utr);
};

export const validateUPITransactionId = (id: string): boolean => {
  // UPI transaction ID validation - typically alphanumeric
  const upiRegex = /^[A-Za-z0-9]{8,20}$/;
  return upiRegex.test(id);
};

// Sets to track used UTR numbers and transaction IDs to prevent duplicates
export const usedUTRNumbers = new Set<string>(['UTR123456789', 'UTR123456788']);
export const usedTransactionIds = new Set<string>(['UPI123456789', 'CASH123456788']);

export const mockNotifications = [
  {
    id: '1',
    title: 'Fee Payment Reminder',
    message: 'Your semester fee payment is due on March 15, 2024.',
    date: '2024-02-28',
    type: 'warning' as const,
    read: false
  },
  {
    id: '2',
    title: 'Scholarship Application Open',
    message: 'Merit-based scholarship applications are now open. Apply before the deadline.',
    date: '2024-02-25',
    type: 'info' as const,
    read: true
  },
  {
    id: '3',
    title: 'System Maintenance',
    message: 'The payment system will be under maintenance on March 1st from 2 AM to 4 AM.',
    date: '2024-02-20',
    type: 'info' as const,
    read: true
  }
];

export const mockScholarships = [
  {
    id: '1',
    studentName: 'John Doe',
    amount: 25000,
    concessionPercentage: 50,
    status: 'approved' as const,
    appliedDate: '2024-02-01',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '1234567890123456',
      ifscCode: 'SBIN0001234',
      branch: 'University Campus Branch'
    }
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    amount: 15000,
    concessionPercentage: 30,
    status: 'pending' as const,
    appliedDate: '2024-02-10',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '9876543210987654',
      ifscCode: 'HDFC0001234',
      branch: 'Main Branch'
    }
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    amount: 10000,
    concessionPercentage: 20,
    status: 'rejected' as const,
    appliedDate: '2024-01-25',
    bankDetails: {
      bankName: 'ICICI Bank',
      accountNumber: '5555666677778888',
      ifscCode: 'ICIC0001234',
      branch: 'City Center Branch'
    }
  }
];

export const mockChallanUploads = [
  {
    id: '1',
    fileName: 'semester_fee_challan.pdf',
    uploadDate: '2024-02-15',
    amount: 52000,
    status: 'verified' as const,
    transactionId: 'TXN123456789'
  },
  {
    id: '2',
    fileName: 'hostel_fee_receipt.pdf',
    uploadDate: '2024-01-10',
    amount: 25000,
    status: 'pending' as const,
    transactionId: 'TXN123456787'
  }
];