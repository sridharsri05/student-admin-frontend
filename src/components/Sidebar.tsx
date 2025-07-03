import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  FileText,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
  { name: "Batches", href: "/batches", icon: BookOpen },
  { name: "Fees & Payments", href: "/fees", icon: CreditCard },
  { name: "Payment Reports", href: "/payment-reports", icon: BarChart3 },
  { name: "WhatsApp", href: "/whatsapp", icon: MessageSquare },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen glass-dark border-r border-white/10 transition-all duration-300 z-20",
      collapsed ? 'w-16 md:w-16' : 'w-64 md:w-64',
      // Mobile styles
      "max-md:transform",
      collapsed ? "max-md:-translate-x-full" : "max-md:w-[80vw]"
    )}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">EduFlow</h1>
              <p className="text-xs text-muted-foreground">Student Management</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground hover:bg-white/10 md:block hidden"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2 flex-grow">
        <div className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30 neon-glow-cyan'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                )
              }
            >
              <item.icon className={cn("flex-shrink-0 w-5 h-5", collapsed ? 'mx-auto' : 'mr-3')} />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className={cn(
        "absolute bottom-4 left-2 right-2",
        collapsed ? "px-2" : "px-0"
      )}>
        {/* Logout Button for Collapsed State */}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-full mb-2 text-muted-foreground hover:text-red-400 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}

        {/* User Profile for Expanded State */}
        {!collapsed && (
          <div className="glass p-4 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{getInitials(user?.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-400 hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
