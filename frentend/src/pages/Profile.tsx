import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';

// Define student type (after mapping)
interface Student {
  name: string;
  registrationNo: string;
  email: string;
  mobile: string;
  branch: string;
  course: string;
  currentSemester: number;
  admissionYear: number;
}

export default function Profile() {
  const [student, setStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("student_token");
        const res = await axios.get("http://localhost:5000/api/student/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data;

        // Map backend fields → frontend fields
        setStudent({
          name: data.fullName,
          registrationNo: data.registrationNumber,
          email: data.email,
          mobile: data.mobile,
          branch: data.branch,
          course: data.course,
          currentSemester: data.semester,
          admissionYear: data.admissionYear
        });
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // Save changes to backend
  const handleSave = async () => {
    if (!student) return;
    try {
      const token = localStorage.getItem("student_token");
      const res = await axios.put(
        "http://localhost:5000/api/student/me",
        {
          fullName: student.name,
          email: student.email,
          mobile: student.mobile,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success("Profile updated successfully!");
      setIsEditing(false);

      // refresh with mapped values
      const updated = res.data;
      setStudent({
        name: updated.fullName,
        registrationNo: updated.registrationNumber,
        email: updated.email,
        mobile: updated.mobile,
        branch: updated.branch,
        course: updated.course,
        currentSemester: updated.semester,
        admissionYear: updated.admissionYear
      });
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!student) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">
                {student.course} - {student.branch}
              </p>
              <Badge variant="secondary" className="mt-2">
                Semester {student.currentSemester}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              {isEditing ? 'Update your personal details' : 'Your personal details'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={student.name}
                  onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNo">Registration Number</Label>
                <Input
                  id="registrationNo"
                  value={student.registrationNo}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={student.email}
                  onChange={(e) => setStudent({ ...student, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={student.mobile}
                  onChange={(e) => setStudent({ ...student, mobile: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input id="course" value={student.course} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" value={student.branch} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionYear">Admission Year</Label>
                <Input id="admissionYear" value={student.admissionYear} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentSemester">Current Semester</Label>
                <Input id="currentSemester" value={student.currentSemester} disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
          <CardDescription>Your academic details and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">{student.course}</h3>
              <p className="text-sm text-muted-foreground">Course</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">{student.branch}</h3>
              <p className="text-sm text-muted-foreground">Branch</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">Semester {student.currentSemester}</h3>
              <p className="text-sm text-muted-foreground">Current Semester</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
