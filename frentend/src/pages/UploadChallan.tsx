import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface OCRResult {
  amount?: number;
  transactionId?: string;
  challanNumber?: string;
  date?: string;
}

export default function UploadChallan() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [uploadType, setUploadType] = useState<'challan' | 'upi'>('challan');
  const [formData, setFormData] = useState({
    studentName: '',
    registrationNumber: '',
    amount: '',
    transactionId: '',
    utrNumber: '',
    paymentDate: '',
    description: ''
  });

  // Auto-fill from backend
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("student_token");
        if (!token) {
          toast.error("Please login first");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/student/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const student = res.data;

        setFormData(prev => ({
          ...prev,
          studentName: student.fullName,
          registrationNumber: student.registrationNumber
        }));
      } catch (err) {
        toast.error("Failed to load student data");
      }
    };

    fetchStudent();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    toast.info('Processing document...');

    try {
      // Replace these mocks with actual OCR API calls
      let result: OCRResult = {
        amount: 1000,
        transactionId: 'TXN12345',
        date: new Date().toISOString().split('T')[0]
      };

      setOcrResult(result);

      setFormData(prev => ({
        ...prev,
        amount: result.amount?.toString() || '',
        transactionId: result.transactionId || result.challanNumber || '',
        paymentDate: result.date || '',
        description: uploadType === 'challan' ? 'Fee payment via bank challan' : 'Fee payment via UPI'
      }));

      toast.success('Document processed successfully!');
    } catch (error) {
      toast.error('Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.studentName || !formData.amount || !formData.transactionId) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Payment record submitted successfully!');

    // Reset amount & transaction but keep student details
    setFormData(prev => ({
      ...prev,
      amount: '',
      transactionId: '',
      utrNumber: '',
      paymentDate: '',
      description: ''
    }));
    setOcrResult(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Upload className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Upload Payment Proof</h1>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Payment Document</CardTitle>
          <CardDescription>
            Upload your bank challan or UPI screenshot for fee payment verification. 
            Your personal details are auto-filled from your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Type Buttons */}
          <div className="flex space-x-4">
            <Button
              variant={uploadType === 'challan' ? 'default' : 'outline'}
              onClick={() => setUploadType('challan')}
            >
              Bank Challan
            </Button>
            <Button
              variant={uploadType === 'upi' ? 'default' : 'outline'}
              onClick={() => setUploadType('upi')}
            >
              UPI Screenshot
            </Button>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <label htmlFor="file-upload" className="cursor-pointer mt-2 block">
              <span className="text-sm font-medium text-gray-900">
                Upload {uploadType === 'challan' ? 'bank challan' : 'UPI screenshot'}
              </span>
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
              <Button className="mt-2" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Choose File'}
              </Button>
            </label>
          </div>

          {/* OCR Result */}
          {ocrResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">
                ✅ Document processed successfully!
              </h3>
              <p>Amount: ₹{ocrResult.amount?.toLocaleString()}</p>
              <p>Transaction ID: {ocrResult.transactionId || ocrResult.challanNumber}</p>
              <p>Date: {ocrResult.date}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name *</Label>
              <Input id="studentName" value={formData.studentName} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number *</Label>
              <Input id="registrationNumber" value={formData.registrationNumber} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionId">
                {uploadType === 'challan' ? 'Challan Number' : 'Transaction ID'} *
              </Label>
              <Input
                id="transactionId"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              />
            </div>
            {uploadType === 'challan' && (
              <div className="space-y-2">
                <Label htmlFor="utrNumber">UTR Number</Label>
                <Input
                  id="utrNumber"
                  value={formData.utrNumber}
                  onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit Payment Record
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
