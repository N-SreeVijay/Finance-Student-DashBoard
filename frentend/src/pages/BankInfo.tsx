import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Building, CreditCard, Info, Smartphone, QrCode, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import QRCode from 'qrcode';

export default function BankInfo() {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);

  const [bankDetails, setBankDetails] = useState<any>(null);
  const [feeStructure, setFeeStructure] = useState<any>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const generateQRCode = async (amount: number) => {
    if (qrCanvasRef.current && bankDetails) {
      try {
        const upiUrl = `${bankDetails.upiQrData}&am=${amount}&tn=Fee%20Payment%20Amount%20${amount}`;
        await QRCode.toCanvas(qrCanvasRef.current, upiUrl, {
          width: 200,
          margin: 2,
          color: { dark: '#000000', light: '#FFFFFF' },
        });
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
        amount = 100000; // auto-reset
      }
      setCustomAmount(amount.toString());
      setSelectedAmount(amount);
      generateQRCode(amount);
    } else {
      setCustomAmount(value); // allow empty input
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
        generateQRCode(feeRes.data.total);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data from server');
      }
    };

    fetchData();
  }, []);

  if (!bankDetails || !feeStructure) return <p>Loading...</p>;

  const predefinedAmounts = [
    { label: 'Full Semester Fee', amount: feeStructure.total },
    { label: 'Tuition Fee Only', amount: feeStructure.tuitionFee },
    { label: 'Exam Fee Only', amount: feeStructure.examFee },
    { label: 'Other Fees', amount: feeStructure.otherFee + feeStructure.insuranceFee },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Building className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Bank & Fee Information</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Bank Details</span>
            </CardTitle>
            <CardDescription>Use these details for fee payment via bank transfer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Bank Name', value: bankDetails.bankName },
                { label: 'Account Number', value: bankDetails.accountNumber },
                { label: 'IFSC Code', value: bankDetails.ifscCode },
                { label: 'Branch', value: bankDetails.branch },
                { label: 'Account Holder', value: bankDetails.accountHolderName },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p
                      className={`font-semibold ${
                        item.label.includes('Number') || item.label.includes('IFSC') ? 'font-mono' : ''
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.value, item.label)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Payment Instructions:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Use your registration number as reference</li>
                    <li>Keep the transaction receipt for records</li>
                    <li>Upload the challan after payment</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UPI Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>UPI Payment</span>
            </CardTitle>
            <CardDescription>Quick payment using UPI apps like PhonePe, GPay, Paytm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground">UPI ID</p>
                  <p className="font-semibold font-mono text-purple-700">{bankDetails.upiId}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankDetails.upiId, 'UPI ID')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Amount Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Payment Amount:</Label>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedAmounts.map((option) => (
                    <Button
                      key={option.label}
                      variant={selectedAmount === option.amount ? 'default' : 'outline'}
                      size="sm"
                      className="justify-between text-xs"
                      onClick={() => handleAmountChange(option.amount)}
                    >
                      <span>{option.label}</span>
                      <span>₹{option.amount.toLocaleString()}</span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customAmount" className="text-xs">Custom Amount:</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="text-sm"
                    min={1}
                    max={100000}
                  />
                </div>
              </div>

              <div className="text-center p-4 bg-white border-2 border-dashed border-gray-200 rounded-lg">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-gray-400" />
                    <p className="text-sm font-medium text-gray-600">QR Code for Payment</p>
                    <Button variant="ghost" size="sm" onClick={refreshQRCode} className="h-6 w-6 p-0">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                  <canvas ref={qrCanvasRef} className="border rounded-lg shadow-sm" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-green-600">Amount: ₹{selectedAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Scan with any UPI app to pay this amount</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">UPI Payment Steps:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Select amount or enter custom amount</li>
                    <li>Scan QR code or use UPI ID</li>
                    <li>Verify amount: ₹{selectedAmount.toLocaleString()}</li>
                    <li>Complete payment in your UPI app</li>
                    <li>Save transaction screenshot</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Fee Structure</span>
            </CardTitle>
            <CardDescription>Current semester fee breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Tuition Fee', value: feeStructure.tuitionFee },
                { label: 'Exam Fee', value: feeStructure.examFee },
                { label: 'Other Fee', value: feeStructure.otherFee },
                { label: 'Insurance Fee', value: feeStructure.insuranceFee },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="font-semibold">₹{item.value.toLocaleString()}</span>
                </div>
              ))}

              <div className="flex justify-between items-center p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <span className="font-semibold text-blue-900">Total Amount</span>
                <Badge variant="default" className="text-lg px-3 py-1">
                  ₹{feeStructure.total.toLocaleString()}
                </Badge>
              </div>
            </div>

            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">Payment Options:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>UPI Payment (instant)</li>
                    <li>Bank transfer</li>
                    <li>Demand Draft</li>
                    <li>Online banking</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
