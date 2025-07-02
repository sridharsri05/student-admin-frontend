import { Bell, Search, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/contexts/ThemeContext"; // adjust path if needed
import { Moon, Sun } from "lucide-react";

export const TopBar = () => {
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    navigate("/settings");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="glass-dark border-b border-white/10 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students, batches, or records..."
              className="pl-10 glass border-white/20 focus:border-primary/50 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-white/10"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-neon-pink text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 glass border-white/20 bg-card/95 backdrop-blur-sm z-50"
            >
              <DropdownMenuLabel className="text-gradient">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-white/10">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">Payment Received</span>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    John Doe paid ₹1,500 for Math course
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-white/10">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">New Student Registration</span>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    Sarah Wilson registered for Physics batch
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-white/10">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">Fee Reminder</span>
                    <span className="text-xs text-muted-foreground">3 hours ago</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    5 students have pending payments
                  </span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-white/10 px-2 sm:px-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {getInitials(user?.name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role || "admin"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 glass border-white/20 bg-card/95 backdrop-blur-sm z-50"
            >
              <DropdownMenuLabel className="text-gradient">
                <div className="flex flex-col">
                  <span>{user?.name || "Admin User"}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {user?.email || "admin@eduflow.com"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={handleProfileClick}
                className="hover:bg-white/10"
              >
                <User className="w-4 h-4 mr-2" />
                Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 hover:bg-red-400/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
