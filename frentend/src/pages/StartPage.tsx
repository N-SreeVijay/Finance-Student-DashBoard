import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Shield, Users, BookOpen } from 'lucide-react';
import LoginDialog from '@/components/LoginDialog';

export default function StartPage() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleStudentLogin = () => {
    setShowLoginDialog(true);
  };

  const handleAdminLogin = () => {
    // For now, just redirect to admin dashboard or show a message
    alert('Admin login functionality will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Fee Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                System
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Streamline your educational financial management with our comprehensive platform
            </p>
          </div>

          {/* Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Card */}
            <Card className="group hover:scale-105 transition-all duration-500 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-6 border border-blue-400/30 group-hover:border-blue-300/50 transition-colors duration-300">
                    <GraduationCap className="h-12 w-12 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Student Portal</CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  Access your fee records, upload challans, and manage payments
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3 text-white/60 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>View payment history</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Upload fee challans</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Track scholarship status</span>
                  </div>
                </div>
                <Button 
                  onClick={handleStudentLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Login as Student
                </Button>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="group hover:scale-105 transition-all duration-500 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-500/20 backdrop-blur-sm rounded-full p-6 border border-purple-400/30 group-hover:border-purple-300/50 transition-colors duration-300">
                    <Shield className="h-12 w-12 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Admin Panel</CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  Manage students, fees, and system administration
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3 text-white/60 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Manage student records</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Process fee payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Generate reports</span>
                  </div>
                </div>
                <Button 
                  onClick={handleAdminLogin}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Login as Admin
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-2 text-white/60">
              <Users className="h-5 w-5" />
              <span>Trusted by thousands of students and institutions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}