import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileImage, Scan, CheckCircle, AlertCircle, X, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { 
  mockOCRProcess, 
  mockUPIOCRProcess, 
  validateUTRFormat, 
  validateUPITransactionId,
  usedUTRNumbers,
  usedTransactionIds
} from '@/data/mockData';
import { ChallanData, UPITransaction, PaymentMethod } from '@/types';

export default function ChallanUpload() {
  const [searchParams] = useSearchParams();
  const initialMethod = (searchParams.get('method') as PaymentMethod) || 'cash';
  
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(initialMethod);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ChallanData | UPITransaction | null>(null);
  const [manualEntry, setManualEntry] = useState(true); // Start with manual entry enabled
  
  // Form data for different payment methods
  const [cashFormData, setCashFormData] = useState({
    challanNumber: '',
    amount: '',
    date: '',
    registrationNo: '',
    studentName: ''
  });

  const [bankFormData, setBankFormData] = useState({
    utrNumber: '',
    amount: '',
    date: '',
    fromBank: '',
    toBank: 'Punjab National Bank'
  });

  const [upiFormData, setUpiFormData] = useState({
    transactionId: '',
    amount: '',
    date: '',
    upiId: '',
    merchantName: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveMethod(initialMethod);
  }, [initialMethod]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedFile(file);
        setExtractedData(null);
        toast.success('File uploaded successfully! You can now process with OCR or continue with manual entry.');
      } else {
        toast.error('Please upload an image file (JPG, PNG, etc.)');
      }
    }
  };

  const processOCR = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setOcrProgress(0);

    const progressInterval = setInterval(() => {
      setOcrProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      if (activeMethod === 'cash') {
        const result = await mockOCRProcess(uploadedFile);
        setOcrProgress(100);
        setExtractedData(result);
        setCashFormData({
          challanNumber: result.challanNumber,
          amount: result.amount.toString(),
          date: result.date,
          registrationNo: result.registrationNo,
          studentName: result.studentName
        });
      } else if (activeMethod === 'upi') {
        const result = await mockUPIOCRProcess(uploadedFile);
        setOcrProgress(100);
        setExtractedData(result);
        setUpiFormData({
          transactionId: result.transactionId,
          amount: result.amount.toString(),
          date: result.date,
          upiId: result.upiId || '',
          merchantName: result.merchantName || ''
        });
      }
      toast.success('Data extracted successfully! You can review and edit the details.');
    } catch (error) {
      toast.error('OCR processing failed. Please continue with manual entry.');
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  };

  const validateForm = () => {
    switch (activeMethod) {
      case 'cash':
        return cashFormData.challanNumber && cashFormData.amount && cashFormData.date;
      case 'bank_transfer':
        if (!bankFormData.utrNumber || !bankFormData.amount || !bankFormData.date) {
          return false;
        }
        if (!validateUTRFormat(bankFormData.utrNumber)) {
          toast.error('Invalid UTR format. Please check and try again.');
          return false;
        }
        if (usedUTRNumbers.has(bankFormData.utrNumber)) {
          toast.error('This UTR number has already been used. Duplicate UTRs are not allowed.');
          return false;
        }
        return true;
      case 'upi':
        if (!upiFormData.transactionId || !upiFormData.amount || !upiFormData.date) {
          return false;
        }
        if (!validateUPITransactionId(upiFormData.transactionId)) {
          toast.error('Invalid UPI Transaction ID format. Please check and try again.');
          return false;
        }
        if (usedTransactionIds.has(upiFormData.transactionId)) {
          toast.error('This Transaction ID has already been used. Duplicate IDs are not allowed.');
          return false;
        }
        return true;
      default:
        return false;
    }
  };

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please fill in all required fields correctly');
    return;
  }

  let payload;
  if (activeMethod === 'cash') {
    payload = { method: 'cash', ...cashFormData, amount: Number(cashFormData.amount) };
  } else if (activeMethod === 'bank_transfer') {
    payload = { method: 'bank_transfer', ...bankFormData, amount: Number(bankFormData.amount) };
  } else if (activeMethod === 'upi') {
    payload = { method: 'upi', ...upiFormData, amount: Number(upiFormData.amount) };
  }
  try {
    const res = await fetch("http://localhost:5000/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("student_token")}`, // if using JWT
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.message || "Payment submission failed");
      return;
    }

    toast.success("Payment submitted successfully!");
    resetForms();
  } catch (error) {
    toast.error("Error submitting payment");
  }
};

  const resetForms = () => {
    setUploadedFile(null);
    setExtractedData(null);
    setManualEntry(true);
    setCashFormData({
      challanNumber: '',
      amount: '',
      date: '',
      registrationNo: '',
      studentName: ''
    });
    setBankFormData({
      utrNumber: '',
      amount: '',
      date: '',
      fromBank: '',
      toBank: 'Punjab National Bank'
    });
    setUpiFormData({
      transactionId: '',
      amount: '',
      date: '',
      upiId: '',
      merchantName: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderUploadSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileImage className="h-5 w-5" />
          <span>Upload {activeMethod === 'cash' ? 'Challan' : activeMethod === 'bank_transfer' ? 'Bank Receipt' : 'UPI Receipt'} (Optional)</span>
        </CardTitle>
        <CardDescription>
          Upload an image to auto-extract details, or skip and enter manually below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="payment-upload"
          />
          <label htmlFor="payment-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop (Optional)
            </p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </label>
        </div>

        {uploadedFile && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{uploadedFile.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {uploadedFile && !isProcessing && !extractedData && (activeMethod === 'cash' || activeMethod === 'upi') && (
          <Button onClick={processOCR} className="w-full" variant="outline">
            <Scan className="mr-2 h-4 w-4" />
            Auto-Extract Data with OCR
          </Button>
        )}

        {uploadedFile && activeMethod === 'bank_transfer' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bank transfer receipts require manual entry. Please fill in the UTR details below.
            </AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Scan className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing {activeMethod === 'cash' ? 'challan' : 'receipt'}...</span>
            </div>
            <Progress value={ocrProgress} />
            <p className="text-xs text-gray-500">
              Extracting data from uploaded image
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCashForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="challanNumber">Challan Number *</Label>
        <Input
          id="challanNumber"
          value={cashFormData.challanNumber}
          onChange={(e) => setCashFormData({ ...cashFormData, challanNumber: e.target.value })}
          placeholder="Enter challan number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount Paid *</Label>
        <Input
          id="amount"
          type="number"
          value={cashFormData.amount}
          onChange={(e) => setCashFormData({ ...cashFormData, amount: e.target.value })}
          placeholder="Enter amount"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Payment Date *</Label>
        <Input
          id="date"
          type="date"
          value={cashFormData.date}
          onChange={(e) => setCashFormData({ ...cashFormData, date: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="registrationNo">Registration Number</Label>
        <Input
          id="registrationNo"
          value={cashFormData.registrationNo}
          onChange={(e) => setCashFormData({ ...cashFormData, registrationNo: e.target.value })}
          placeholder="Enter registration number"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="studentName">Student Name</Label>
        <Input
          id="studentName"
          value={cashFormData.studentName}
          onChange={(e) => setCashFormData({ ...cashFormData, studentName: e.target.value })}
          placeholder="Enter student name"
        />
      </div>
    </div>
  );

  const renderBankForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="utrNumber">UTR Number *</Label>
        <Input
          id="utrNumber"
          value={bankFormData.utrNumber}
          onChange={(e) => setBankFormData({ ...bankFormData, utrNumber: e.target.value.toUpperCase() })}
          placeholder="Enter UTR number"
          className="font-mono"
        />
        <p className="text-xs text-gray-500">12-digit number or alphanumeric code from your bank</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bankAmount">Amount Transferred *</Label>
        <Input
          id="bankAmount"
          type="number"
          value={bankFormData.amount}
          onChange={(e) => setBankFormData({ ...bankFormData, amount: e.target.value })}
          placeholder="Enter amount"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bankDate">Transfer Date *</Label>
        <Input
          id="bankDate"
          type="date"
          value={bankFormData.date}
          onChange={(e) => setBankFormData({ ...bankFormData, date: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fromBank">From Bank</Label>
        <Input
          id="fromBank"
          value={bankFormData.fromBank}
          onChange={(e) => setBankFormData({ ...bankFormData, fromBank: e.target.value })}
          placeholder="Your bank name"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="toBank">To Bank (University Account)</Label>
        <Input
          id="toBank"
          value={bankFormData.toBank}
          onChange={(e) => setBankFormData({ ...bankFormData, toBank: e.target.value })}
          disabled
        />
      </div>
    </div>
  );

  const renderUPIForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="transactionId">Transaction ID *</Label>
        <Input
          id="transactionId"
          value={upiFormData.transactionId}
          onChange={(e) => setUpiFormData({ ...upiFormData, transactionId: e.target.value })}
          placeholder="Enter UPI transaction ID"
          className="font-mono"
        />
        <p className="text-xs text-gray-500">12-digit ID from your UPI app</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="upiAmount">Amount Paid *</Label>
        <Input
          id="upiAmount"
          type="number"
          value={upiFormData.amount}
          onChange={(e) => setUpiFormData({ ...upiFormData, amount: e.target.value })}
          placeholder="Enter amount"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="upiDate">Payment Date *</Label>
        <Input
          id="upiDate"
          type="date"
          value={upiFormData.date}
          onChange={(e) => setUpiFormData({ ...upiFormData, date: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="upiId">UPI ID</Label>
        <Input
          id="upiId"
          value={upiFormData.upiId}
          onChange={(e) => setUpiFormData({ ...upiFormData, upiId: e.target.value })}
          placeholder="your-id@phonepe"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="merchantName">Merchant Name</Label>
        <Input
          id="merchantName"
          value={upiFormData.merchantName}
          onChange={(e) => setUpiFormData({ ...upiFormData, merchantName: e.target.value })}
          placeholder="University name"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Upload className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Payment Upload</h1>
      </div>

      <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as PaymentMethod)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cash" className="flex items-center space-x-2">
            <span>💵</span>
            <span>Cash Payment</span>
          </TabsTrigger>
          <TabsTrigger value="bank_transfer" className="flex items-center space-x-2">
            <span>🏦</span>
            <span>Bank Transfer</span>
          </TabsTrigger>
          <TabsTrigger value="upi" className="flex items-center space-x-2">
            <span>📱</span>
            <span>UPI / PhonePe</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cash" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderUploadSection()}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>Challan Details</span>
                </CardTitle>
                <CardDescription>
                  {extractedData ? 'Review and edit the extracted information' : 'Enter challan details'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {extractedData && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Data extracted successfully! Please review and edit if needed.
                    </AlertDescription>
                  </Alert>
                )}
                {renderCashForm()}
                <Button onClick={handleSubmit} className="w-full">
                  Submit Challan
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bank_transfer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderUploadSection()}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>Bank Transfer Details</span>
                </CardTitle>
                <CardDescription>
                  Enter your UTR number and transfer details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderBankForm()}
                <Button onClick={handleSubmit} className="w-full">
                  Submit Bank Transfer
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderUploadSection()}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>UPI Payment Details</span>
                </CardTitle>
                <CardDescription>
                  {extractedData ? 'Review and edit the extracted information' : 'Enter UPI transaction details'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {extractedData && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      UPI data extracted successfully! Please review and edit if needed.
                    </AlertDescription>
                  </Alert>
                )}
                {renderUPIForm()}
                <Button onClick={handleSubmit} className="w-full">
                  Submit UPI Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}