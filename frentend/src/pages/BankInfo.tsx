import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Building, CreditCard, Info, Smartphone, QrCode, RefreshCw, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import QRCode from 'qrcode';

export default function BankInfo() {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrCanvasRefAllInfo = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [activeTab, setActiveTab] = useState('quick-pay');

  // Collapsible states
  const [bankDetailsOpen, setBankDetailsOpen] = useState(false);
  const [feeBreakdownOpen, setFeeBreakdownOpen] = useState(true);
  const [paymentInstructionsOpen, setPaymentInstructionsOpen] = useState(false);

  const [bankDetails, setBankDetails] = useState<any>(null);
  const [feeStructure, setFeeStructure] = useState<any>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const generateQRCode = async (amount: number) => {
    if (bankDetails) {
      try {
        const upiUrl = `${bankDetails.upiQrData}&am=${amount}&tn=Fee%20Payment%20Amount%20${amount}`;
        
        // Generate QR for main tab
        if (qrCanvasRef.current) {
          await QRCode.toCanvas(qrCanvasRef.current, upiUrl, {
            width: 200,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' },
          });
        }
        
        // Generate QR for all info tab
        if (qrCanvasRefAllInfo.current) {
          await QRCode.toCanvas(qrCanvasRefAllInfo.current, upiUrl, {
            width: 150,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' },
          });
        }
        
        setQrGenerated(true);
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast.error('Failed to generate QR code');
      }
    }
  };

  const handleAmountChange = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    generateQRCode(amount);
  };

  const handleCustomAmountChange = (value: string) => {
    let amount = parseFloat(value);

    if (!isNaN(amount) && amount > 0) {
      if (amount > 100000) {
        toast.error('Maximum allowed amount is ₹1,00,000');
        amount = 100000;
      }
      setCustomAmount(amount.toString());
      setSelectedAmount(amount);
      generateQRCode(amount);
    } else {
      setCustomAmount(value);
    }
  };

  const refreshQRCode = () => {
    generateQRCode(selectedAmount);
    toast.success('QR code refreshed!');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bankRes, feeRes] = await Promise.all([
          axios.get('http://localhost:5000/api/bank'),
          axios.get('http://localhost:5000/api/fee'),
        ]);

        setBankDetails(bankRes.data);
        setFeeStructure(feeRes.data);
        setSelectedAmount(feeRes.data.total);
        
        // Generate QR codes after data is loaded
        setTimeout(() => {
          generateQRCode(feeRes.data.total);
        }, 100);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data from server');
      }
    };

    fetchData();
  }, []);

  if (!bankDetails || !feeStructure) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading bank and fee information...</p>
      </div>
    </div>
  );

  const predefinedAmounts = [
    { label: 'Full Semester Fee', amount: feeStructure.total, color: 'bg-blue-500' },
    { label: 'Tuition Fee Only', amount: feeStructure.tuitionFee, color: 'bg-green-500' },
    { label: 'Exam Fee Only', amount: feeStructure.examFee, color: 'bg-orange-500' },
    { label: 'Other Fees', amount: feeStructure.otherFee + feeStructure.insuranceFee, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Payment Center</h1>
            <p className="text-muted-foreground">Manage your fee payments easily</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="hidden md:flex space-x-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Fee</p>
            <p className="text-xl font-bold text-green-600">₹{feeStructure.total.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border">
            <p className="text-sm text-muted-foreground">Selected Amount</p>
            <p className="text-xl font-bold text-blue-600">₹{selectedAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="quick-pay" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Pay</span>
          </TabsTrigger>
          <TabsTrigger value="bank-details" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Bank Details</span>
          </TabsTrigger>
          <TabsTrigger value="fee-structure" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Fee Structure</span>
          </TabsTrigger>
          <TabsTrigger value="all-info" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">All Info</span>
          </TabsTrigger>
        </TabsList>

        {/* Quick Pay Tab */}
        <TabsContent value="quick-pay" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* UPI Payment Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  <span>UPI Quick Payment</span>
                </CardTitle>
                <CardDescription>Instant payment using UPI apps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* UPI ID */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                  <div>
                    <p className="text-sm text-muted-foreground">UPI ID</p>
                    <p className="font-semibold font-mono text-purple-700 text-lg">{bankDetails.upiId}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(bankDetails.upiId, 'UPI ID')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Amount Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Select Payment Amount:</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {predefinedAmounts.map((option) => (
                      <Button
                        key={option.label}
                        variant={selectedAmount === option.amount ? 'default' : 'outline'}
                        size="lg"
                        className="justify-between h-auto p-4"
                        onClick={() => handleAmountChange(option.amount)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <span className="text-lg font-bold">₹{option.amount.toLocaleString()}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customAmount" className="text-base font-semibold">Custom Amount:</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="Enter custom amount (max ₹1,00,000)"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="text-lg h-12"
                      min={1}
                      max={100000}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-green-600" />
                    <span>Scan & Pay</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={refreshQRCode}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>Scan this QR code with any UPI app</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="flex justify-center p-6 bg-white border-2 border-dashed border-gray-200 rounded-lg">
                    <canvas ref={qrCanvasRef} className="border rounded-lg shadow-sm" />
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₹{selectedAmount.toLocaleString()}</p>
                    <p className="text-sm text-green-700 mt-1">Amount to be paid</p>
                  </div>
                  <div className="text-left p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">Payment Steps:</p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Open any UPI app (PhonePe, GPay, Paytm)</li>
                      <li>Scan the QR code above</li>
                      <li>Verify amount: ₹{selectedAmount.toLocaleString()}</li>
                      <li>Complete payment</li>
                      <li>Save transaction screenshot</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bank Details Tab */}
        <TabsContent value="bank-details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-blue-600" />
                <span>Bank Transfer Details</span>
              </CardTitle>
              <CardDescription>Use these details for NEFT/RTGS/IMPS transfers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Bank Name', value: bankDetails.bankName, icon: '🏦' },
                  { label: 'Account Number', value: bankDetails.accountNumber, icon: '🔢' },
                  { label: 'IFSC Code', value: bankDetails.ifscCode, icon: '🏷️' },
                  { label: 'Branch', value: bankDetails.branch, icon: '📍' },
                  { label: 'Account Holder', value: bankDetails.accountHolderName, icon: '👤' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className={`font-semibold text-lg ${
                          item.label.includes('Number') || item.label.includes('IFSC') ? 'font-mono' : ''
                        }`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Collapsible open={paymentInstructionsOpen} onOpenChange={setPaymentInstructionsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center space-x-2">
                      <Info className="h-4 w-4" />
                      <span>Payment Instructions</span>
                    </span>
                    {paymentInstructionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-900">Important Instructions:</h4>
                      <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                        <li><strong>Reference:</strong> Always use your registration number as reference</li>
                        <li><strong>Receipt:</strong> Keep the transaction receipt for your records</li>
                        <li><strong>Verification:</strong> Upload the payment challan after successful transfer</li>
                        <li><strong>Processing Time:</strong> Bank transfers may take 2-24 hours to process</li>
                        <li><strong>Contact:</strong> Contact accounts department for any payment issues</li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fee Structure Tab */}
        <TabsContent value="fee-structure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span>Current Semester Fee Structure</span>
              </CardTitle>
              <CardDescription>Detailed breakdown of all fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Tuition Fee', value: feeStructure.tuitionFee, icon: '📚', color: 'text-blue-600' },
                  { label: 'Exam Fee', value: feeStructure.examFee, icon: '📝', color: 'text-orange-600' },
                  { label: 'Other Fee', value: feeStructure.otherFee, icon: '🏫', color: 'text-purple-600' },
                  { label: 'Insurance Fee', value: feeStructure.insuranceFee, icon: '🛡️', color: 'text-green-600' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-medium text-lg">{item.label}</span>
                    </div>
                    <span className={`font-bold text-xl ${item.color}`}>₹{item.value.toLocaleString()}</span>
                  </div>
                ))}

                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">💰</span>
                    <span className="font-bold text-xl text-blue-900">Total Amount</span>
                  </div>
                  <Badge variant="default" className="text-2xl px-4 py-2 bg-blue-600">
                    ₹{feeStructure.total.toLocaleString()}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-3 flex items-center space-x-2">
                  <Info className="h-4 w-4" />
                  <span>Available Payment Methods:</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { method: 'UPI Payment', icon: '📱', status: 'Instant' },
                    { method: 'Bank Transfer', icon: '🏦', status: '2-24 hrs' },
                    { method: 'Demand Draft', icon: '📄', status: 'Manual' },
                    { method: 'Online Banking', icon: '💻', status: 'Instant' },
                  ].map((payment) => (
                    <div key={payment.method} className="text-center p-3 bg-white border rounded-lg">
                      <div className="text-2xl mb-1">{payment.icon}</div>
                      <div className="text-sm font-medium">{payment.method}</div>
                      <div className="text-xs text-muted-foreground">{payment.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Info Tab */}
        <TabsContent value="all-info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Collapsible Bank Details */}
            <Card>
              <Collapsible open={bankDetailsOpen} onOpenChange={setBankDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>Bank Details</span>
                      </div>
                      {bankDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                    <CardDescription>Click to {bankDetailsOpen ? 'hide' : 'show'} bank transfer details</CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'Bank Name', value: bankDetails.bankName },
                      { label: 'Account Number', value: bankDetails.accountNumber },
                      { label: 'IFSC Code', value: bankDetails.ifscCode },
                      { label: 'Branch', value: bankDetails.branch },
                      { label: 'Account Holder', value: bankDetails.accountHolderName },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="font-medium text-sm">{item.value}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.value, item.label)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* UPI Payment with Amount Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>UPI Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">UPI ID</p>
                    <p className="font-semibold font-mono text-sm">{bankDetails.upiId}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankDetails.upiId, 'UPI ID')}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                {/* Amount Selection in All Info Tab */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Amount:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {predefinedAmounts.map((option) => (
                      <Button
                        key={option.label}
                        variant={selectedAmount === option.amount ? 'default' : 'outline'}
                        size="sm"
                        className="justify-between text-xs h-8"
                        onClick={() => handleAmountChange(option.amount)}
                      >
                        <span>{option.label}</span>
                        <span>₹{option.amount.toLocaleString()}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customAmountAllInfo" className="text-xs">Custom:</Label>
                    <Input
                      id="customAmountAllInfo"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="text-sm h-8"
                      min={1}
                      max={100000}
                    />
                  </div>
                </div>

                <div className="text-center p-4 bg-white border rounded-lg">
                  <div className="flex justify-center mb-2">
                    <canvas ref={qrCanvasRefAllInfo} className="border rounded shadow-sm" />
                  </div>
                  <p className="text-sm font-semibold text-green-600">₹{selectedAmount.toLocaleString()}</p>
                  <Button variant="ghost" size="sm" onClick={refreshQRCode} className="mt-2">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span className="text-xs">Refresh</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible Fee Structure */}
            <Card className="lg:col-span-2 xl:col-span-1">
              <Collapsible open={feeBreakdownOpen} onOpenChange={setFeeBreakdownOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Fee Structure</span>
                      </div>
                      {feeBreakdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                    <CardDescription>Click to {feeBreakdownOpen ? 'hide' : 'show'} fee breakdown</CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'Tuition Fee', value: feeStructure.tuitionFee },
                      { label: 'Exam Fee', value: feeStructure.examFee },
                      { label: 'Other Fee', value: feeStructure.otherFee },
                      { label: 'Insurance Fee', value: feeStructure.insuranceFee },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="font-semibold text-sm">₹{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-blue-50 border-2 border-blue-200 rounded">
                      <span className="font-semibold text-blue-900">Total</span>
                      <Badge variant="default" className="px-2 py-1">
                        ₹{feeStructure.total.toLocaleString()}
                      </Badge>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}