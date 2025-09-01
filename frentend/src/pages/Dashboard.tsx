import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { Wallet, BookOpen, Clock, AlertTriangle } from "lucide-react";

// Types
interface DashboardStudent {
  fullName: string;
  registrationNumber: string;
  course: string;
  branch: string;
  currentSemester: number;
  admissionYear: number;
  semfees: number;
}

interface DashboardPayment {
  _id: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

export default function Dashboard() {
  const [student, setStudent] = useState<DashboardStudent | null>(null);
  const [payments, setPayments] = useState<DashboardPayment[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("student_token");
        if (!token) {
          toast.error("You must login first");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res1 = await axios.get("http://localhost:5000/api/student/me", {
                  headers: { Authorization: `Bearer ${token}` }
                });

        const data = res.data;
        const data1 = res1.data;

        const studentData = data1.student || data1; // fallback if plain object
        const paymentsData: DashboardPayment[] = data.payments || [];

        // Set student info
        setStudent({
          fullName: studentData.fullName || "-",
          registrationNumber: studentData.registrationNumber || "-",
          course: studentData.course || "-",
          branch: studentData.branch || "-",
          currentSemester: studentData.semester ?? 0,
          admissionYear: studentData.admissionYear ?? 0,
          semfees: studentData.semFees ?? 0,
        });

        // Filter paid payments
        const paidPayments = paymentsData.filter((p) => p.status === "paid");

        // Calculate totals
        const totalPaidAmount = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalDueAmount = Math.max((studentData.semfees ?? 0) - totalPaidAmount, 0);

        // Sort payments by date descending and take latest 5
        const recentPayments = paidPayments
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setPayments(recentPayments);
        setTotalPaid(totalPaidAmount);
        setTotalDue(totalDueAmount);

      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  if (!student) {
    return <p className="text-center mt-10 text-red-600">No student data available</p>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {student.fullName}</h1>
        <p className="text-gray-600">Registration No: {student.registrationNumber}</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{student.course}</div>
            <p className="text-sm text-gray-500">{student.branch}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">Semester {student.currentSemester}</div>
            <Badge variant="secondary">Admission {student.admissionYear}</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Your last few transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-gray-600">No payments found</p>
          ) : (
            <div className="space-y-4">
              {payments.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-2">
                    {p.method === "cash" && <Wallet className="h-4 w-4 text-orange-500" />}
                    {p.method === "bank_transfer" && <BookOpen className="h-4 w-4 text-blue-500" />}
                    {p.method === "upi" && <Clock className="h-4 w-4 text-purple-500" />}
                    <span className="text-sm font-medium">₹{p.amount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={
                        p.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : p.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {p.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(p.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fee Due Alert */}
      {totalDue > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Outstanding Balance</span>
            </CardTitle>
            <CardDescription>
              Please complete your payment to avoid late fees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">₹{totalDue.toLocaleString()} Due</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
