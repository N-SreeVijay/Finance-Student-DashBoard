import { Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<{ fullName: string; email: string } | null>(null);

  // Load student details from localStorage
  useEffect(() => {
    const storedStudent = localStorage.getItem('student_info');
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('finance_token'); // clear auth token
    localStorage.removeItem('student');       // clear student info
    navigate('/start'); 
  };

  const goToProfile = () => navigate('/profile');
  const goToSettings = () => navigate('/settings');

  // Temporary static notifications (you can fetch from API later)
  const mockNotifications = [
    { id: 1, title: "Payment Reminder", message: "Your fee is due soon", date: "2025-08-30", read: false },
    { id: 2, title: "Profile Updated", message: "Your profile changes were saved", date: "2025-08-29", read: true }
  ];
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Student Portal</h2>
          <p className="text-sm text-gray-600">
            Welcome back, {student?.fullName}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockNotifications.slice(0, 3).map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-400 mt-1">{notification.date}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{student?.fullName || "Student"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{student?.email || ""}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={goToProfile} className="flex items-center space-x-2">
                <User className="h-4 w-4" /> <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={goToSettings} className="flex items-center space-x-2">
                <Settings className="h-4 w-4" /> <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                <LogOut className="h-4 w-4" /> <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
