import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="glass border-white/10 shadow-xl">
          <CardContent className="p-10 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for specific role
  if (requiredRole && role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass border-white/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check for any of the allowed roles
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass border-white/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
};
