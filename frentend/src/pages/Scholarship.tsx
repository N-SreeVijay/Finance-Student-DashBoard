import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Award, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Scholarship as ScholarshipType } from '@/types';

export default function Scholarship() {
  const [scholarships, setScholarships] = useState<ScholarshipType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    registrationNumber: '',
    sem: '', // Added semester
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    amount: '',
    concessionPercentage: ''
  });

  // Fetch scholarships
  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    const token = localStorage.getItem('student_token');
    if (!token) {
      toast.error("You must be logged in as a student");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/scholarships", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Failed to fetch scholarships");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setScholarships(data.map((s: any) => ({
        ...s,
        id: s.id || s._id,
        bankDetails: s.bankDetails || { bankName: '', accountNumber: '', ifscCode: '', branch: '' }
      })));
    } catch (error) {
      toast.error("Error fetching scholarships");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill student details on new form
  useEffect(() => {
    if (showForm && !editingId) {
      const student = JSON.parse(localStorage.getItem("student_info") || "{}");
      setFormData(prev => ({
        ...prev,
        studentName: student?.fullName || '',
        registrationNumber: student?.registrationNumber || '',
        sem: student?.semester || '' // Auto-fill semester
      }));
    }
  }, [showForm, editingId]);

  const handleSubmit = async () => {
    if (!formData.studentName || !formData.amount || !formData.concessionPercentage) {
      toast.error('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem("student_token");
    if (!token) {
      toast.error("You must be logged in as a student");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/scholarships/${editingId}`
        : "http://localhost:5000/api/scholarships";
      const method = editingId ? "PUT" : "POST";

      const body = {
        ...formData,
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          branch: formData.branch
        }
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Submission failed");
        return;
      }

      const savedApplication = await res.json();
      toast.success(editingId ? "Application updated successfully!" : "Application submitted successfully!");

      if (editingId) {
        setScholarships(prev =>
          prev.map(s => (s.id === savedApplication.id || s.id === savedApplication._id ? savedApplication : s))
        );
      } else {
        setScholarships(prev => [
          { ...savedApplication, id: savedApplication.id || savedApplication._id, bankDetails: savedApplication.bankDetails || {} },
          ...prev
        ]);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        studentName: '',
        registrationNumber: '',
        sem: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branch: '',
        amount: '',
        concessionPercentage: ''
      });
    } catch (error) {
      toast.error("Error submitting scholarship application");
    }
  };

  const handleEdit = (scholarship: ScholarshipType) => {
    setFormData({
      studentName: scholarship.studentName,
      registrationNumber: scholarship.registrationNumber,
      sem: scholarship.sem || '',
      bankName: scholarship.bankDetails?.bankName || '',
      accountNumber: scholarship.bankDetails?.accountNumber || '',
      ifscCode: scholarship.bankDetails?.ifscCode || '',
      branch: scholarship.bankDetails?.branch || '',
      amount: scholarship.amount.toString(),
      concessionPercentage: scholarship.concessionPercentage.toString()
    });
    setEditingId(scholarship.id || (scholarship as any)._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid scholarship ID");
      return;
    }
    if (!confirm("Are you sure you want to delete this application?")) return;

    const token = localStorage.getItem("student_token");
    if (!token) {
      toast.error("You must be logged in as a student");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Failed to delete");
        return;
      }

      toast.success("Application deleted successfully!");
      setScholarships(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      toast.error("Error deleting application");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Scholarship Management</h1>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <Plus className="mr-2 h-4 w-4" />
          Apply for Scholarship
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Scholarship Application" : "New Scholarship Application"}</CardTitle>
            <CardDescription>Fill in the details. Your personal details are auto-filled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                  readOnly
                  className="bg-blue-50 border-blue-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                  readOnly
                  className="bg-blue-50 border-blue-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sem">Semester *</Label>
                <Input
                  id="sem"
                  value={formData.sem}
                  readOnly
                  className="bg-blue-50 border-blue-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Scholarship Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="concessionPercentage">Concession Percentage *</Label>
                <Input
                  id="concessionPercentage"
                  type="number"
                  value={formData.concessionPercentage}
                  onChange={e => setFormData({ ...formData, concessionPercentage: e.target.value })}
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  value={formData.ifscCode}
                  onChange={e => setFormData({ ...formData, ifscCode: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={e => setFormData({ ...formData, branch: e.target.value })}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSubmit}>{editingId ? "Update Application" : "Submit Application"}</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Scholarship Applications</CardTitle>
          <CardDescription>Track the status of your scholarship applications</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading scholarships...</p>
          ) : scholarships.length === 0 ? (
            <div className="text-center py-8">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No scholarship applications found</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>Apply for Scholarship</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {scholarships.map((scholarship, index) => (
                <div key={scholarship.id || index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{scholarship.studentName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Reg No: {scholarship.registrationNumber} | Semester: {scholarship.sem}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Applied on {new Date(scholarship.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(scholarship.status)}>
                        {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(scholarship)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(scholarship.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">₹{scholarship.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Concession</p>
                      <p className="font-semibold">{scholarship.concessionPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bank</p>
                      <p className="font-semibold">{scholarship.bankDetails?.bankName || '-'}</p>
                    </div>
                  </div>

                  {scholarship.status === 'approved' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        🎉 Congratulations! Your scholarship has been approved. The amount will be credited to your account within 5-7 business days.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
