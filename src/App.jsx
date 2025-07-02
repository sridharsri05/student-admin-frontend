import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Students } from "./pages/Students";
import { Batches } from "./pages/Batches";
import { PaymentReports } from "./pages/PaymentReports";
import { WhatsAppIntegration } from "./pages/WhatsAppIntegration";
import { Login } from "./pages/Login";
import { Settings } from "./pages/Settings";
import { Fees } from "./pages/Fees";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Reports } from "./pages/Reports";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { StudentDashboard } from "./pages/StudentDashboard";
const queryClient = new QueryClient();

const App = () => {
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  //   script.async = true;
  //   document.head.appendChild(script);

  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/student-dashboard"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <Layout>
                        <StudentDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/students" element={<Students />} />
                          <Route path="/batches" element={<Batches />} />
                          <Route path="/fees" element={<Fees />} />
                          <Route path="/payment-reports" element={<PaymentReports />} />
                          <Route path="/whatsapp" element={<WhatsAppIntegration />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
