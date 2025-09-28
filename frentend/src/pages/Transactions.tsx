import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Receipt, Search, Download, Filter, Shield, AlertTriangle } from 'lucide-react';

// Define types
interface Payment {
  _id: string;
  studentId: string;
  method: string;
  amount: number;
  date: string;
  challanNumber?: string;
  registrationNo: string;
  studentName: string;
  utrNumber?: string;
  fromBank?: string;
  toBank?: string;
  transactionId?: string;
  upiId?: string;
  merchantName?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  paymentMethod: PaymentMethod;
  amount: number;
  date: string;
  challanNumber?: string;
  utrNumber?: string;
  transactionId?: string;
  semester?: string;
  status: 'paid' | 'pending' | 'processing' | 'failed';
  verificationStatus?: 'verified' | 'rejected' | 'pending';
}

type PaymentMethod = 'cash' | 'bank_transfer' | 'upi';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('student_token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        // Get student profile (for semester info)
        const studentRes = await axios.get("http://localhost:5000/api/student/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const studentData = studentRes.data;

        // Get payments
        const paymentsRes = await axios.get("http://localhost:5000/api/payments", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const payments: Payment[] = paymentsRes.data;

        const mappedTransactions: Transaction[] = payments.map(payment => ({
          id: payment._id,
          paymentMethod: payment.method as PaymentMethod,
          amount: payment.amount,
          date: payment.date,
          challanNumber: payment.challanNumber,
          utrNumber: payment.utrNumber,
          transactionId: payment.transactionId,
          semester: studentData.semester, 
          status: payment.status as 'paid' | 'pending' | 'processing' | 'failed',
          verificationStatus: payment.status === 'paid' ? 'verified' : payment.status === 'failed' ? 'rejected' : 'pending',
        }));

        setTransactions(mappedTransactions);
      } catch (err: any) {
        setError(err.message || 'Error fetching transactions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const searchFields = [
      transaction.challanNumber,
      transaction.utrNumber,
      transaction.transactionId,
      transaction.semester,
    ].filter(Boolean).join(' ').toLowerCase();
    
    const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || transaction.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getMethodColor = (method: PaymentMethod) => {
    switch (method) {
      case 'cash': return 'bg-orange-100 text-orange-800';
      case 'bank_transfer': return 'bg-blue-100 text-blue-800';
      case 'upi': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'cash': return '💵';
      case 'bank_transfer': return '🏦';
      case 'upi': return '📱';
      default: return '💳';
    }
  };

  const getVerificationIcon = (status?: string) => {
    switch (status) {
      case 'verified': return <Shield className="h-4 w-4 text-green-600" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const totalPaid = transactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter(t => t.status === 'pending' || t.status === 'processing')
    .reduce((sum, t) => sum + t.amount, 0);

  const methodStats = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<PaymentMethod, number>);

  const handleExport = () => {
    if (transactions.length === 0) {
      alert('No transactions available to export.');
      return;
    }

    const headers = ['ID', 'Payment Method', 'Amount', 'Date', 'Challan Number', 'UTR Number', 'Transaction ID', 'Semester', 'Status', 'Verification Status'];
    const csvRows = [
      headers.join(','),
      ...transactions.map(transaction =>
        [
          transaction.id,
          transaction.paymentMethod,
          transaction.amount,
          new Date(transaction.date).toLocaleDateString(),
          transaction.challanNumber || '',
          transaction.utrNumber || '',
          transaction.transactionId || '',
          transaction.semester || '',
          transaction.status,
          transaction.verificationStatus || 'pending',
        ].map(value => `"${value}"`).join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Receipt className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Transaction History</h1>
        </div>
        <Button onClick={handleExport} disabled={transactions.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-1">
              {Object.entries(methodStats).map(([method, count]) => (
                <Badge key={method} variant="secondary" className="text-xs">
                  {getMethodIcon(method as PaymentMethod)} {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>View and manage all your fee payment transactions across different methods</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by challan, UTR, transaction ID, or semester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">💵 Cash Payment</SelectItem>
                <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
                <SelectItem value="upi">📱 UPI / PhonePe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        No transactions found matching your criteria
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getMethodIcon(transaction.paymentMethod)}</span>
                          <Badge className={getMethodColor(transaction.paymentMethod)}>
                            {transaction.paymentMethod === 'cash' && 'Cash'}
                            {transaction.paymentMethod === 'bank_transfer' && 'Bank'}
                            {transaction.paymentMethod === 'upi' && 'UPI'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.paymentMethod === 'cash' && transaction.challanNumber}
                        {transaction.paymentMethod === 'bank_transfer' && transaction.utrNumber}
                        {transaction.paymentMethod === 'upi' && transaction.transactionId}
                      </TableCell>
                      <TableCell>{transaction.semester || 'N/A'}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getVerificationIcon(transaction.verificationStatus)}
                          <span className="text-xs text-muted-foreground">
                            {transaction.verificationStatus || 'pending'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-lg">💵</span>
              <span>Cash Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.filter(t => t.paymentMethod === 'cash').map(t => (
                <div key={t.id} className="flex justify-between text-sm">
                  <span>#{t.challanNumber}</span>
                  <span>₹{t.amount.toLocaleString()}</span>
                </div>
              ))}
              {transactions.filter(t => t.paymentMethod === 'cash').length === 0 && (
                <p className="text-sm text-muted-foreground">No cash payments</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-lg">🏦</span>
              <span>Bank Transfers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.filter(t => t.paymentMethod === 'bank_transfer').map(t => (
                <div key={t.id} className="flex justify-between text-sm">
                  <span className="font-mono">{t.utrNumber}</span>
                  <span>₹{t.amount.toLocaleString()}</span>
                </div>
              ))}
              {transactions.filter(t => t.paymentMethod === 'bank_transfer').length === 0 && (
                <p className="text-sm text-muted-foreground">No bank transfers</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-lg">📱</span>
              <span>UPI Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.filter(t => t.paymentMethod === 'upi').map(t => (
                <div key={t.id} className="flex justify-between text-sm">
                  <span className="font-mono">{t.transactionId}</span>
                  <span>₹{t.amount.toLocaleString()}</span>
                </div>
              ))}
              {transactions.filter(t => t.paymentMethod === 'upi').length === 0 && (
                <p className="text-sm text-muted-foreground">No UPI payments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
