import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Download,
  Filter,
  Search,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { PaymentAnalytics } from "@/components/payments/PaymentAnalytics";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { EnhancedPaymentAnalytics } from "@/components/payments/EnhancedPaymentAnalytics";
import { PaymentStats } from "@/components/payments/PaymentStats";
import { EMIManagement } from "@/components/payments/EMIManagement";
import { usePayments } from "@/hooks/usePayments";
import {
  exportPaymentsToPDF,
  exportPaymentsToExcel,
} from "@/components/payments/PaymentExportUtils";
import { toast } from "@/hooks/use-toast";

export const PaymentReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("this-month");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [filters, setFilters] = useState({});

  const { payments, analytics, loading, error, fetchPayments, fetchAnalytics, refetch } =
    usePayments();

  const handleExportReport = async () => {
    try {
      if (exportFormat === "pdf") {
        await exportPaymentsToPDF(payments, analytics, filters);
        toast({
          title: "PDF Report Generated",
          description: "Your payment report has been downloaded successfully.",
        });
      } else {
        exportPaymentsToExcel(payments, analytics, filters);
        toast({
          title: "Excel Report Generated",
          description: "Your payment report has been downloaded successfully.",
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshData = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Payment data has been updated.",
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    const newFilters = { ...filters };

    const now = new Date();
    switch (value) {
      case "today":
        newFilters.dateFrom = now.toISOString().split("T")[0];
        newFilters.dateTo = now.toISOString().split("T")[0];
        break;
      case "this-week":
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        newFilters.dateFrom = weekStart.toISOString().split("T")[0];
        newFilters.dateTo = new Date().toISOString().split("T")[0];
        break;
      case "this-month":
        newFilters.dateFrom = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        newFilters.dateTo = new Date().toISOString().split("T")[0];
        break;
      case "last-month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        newFilters.dateFrom = lastMonth.toISOString().split("T")[0];
        newFilters.dateTo = lastMonthEnd.toISOString().split("T")[0];
        break;
      default:
        delete newFilters.dateFrom;
        delete newFilters.dateTo;
    }

    setFilters(newFilters);
    fetchPayments(newFilters);
    fetchAnalytics(newFilters);
  };

  const filteredPayments = payments.filter((payment) => {
    if (!searchTerm) return true;

    const studentName = payment.students?.name || payment.studentName || "";
    const paymentId = payment.id || "";
    const amount = payment.amount?.toString() || "";

    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amount.includes(searchTerm)
    );
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  if (loading && !payments.length) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient flex items-center gap-2">
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-neon-green" />
            Payment Reports
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track payments, revenue, and financial analytics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="glass border-white/20 w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20 bg-card z-50">
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/10 w-full sm:w-auto"
            onClick={handleRefreshData}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button
            className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80 w-full sm:w-auto"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <PaymentStats analytics={analytics} loading={loading} />

      {/* Tabs - Mobile Responsive */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass border-white/20 grid w-full grid-cols-5 h-auto p-1 gap-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm px-2 py-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm px-2 py-2"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="emi"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm px-2 py-2"
          >
            EMI Payments
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm px-2 py-2"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="filters"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm px-2 py-2"
          >
            Filters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient text-lg">Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredPayments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg glass border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {payment.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
                        ) : payment.status === "failed" ? (
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-neon-pink flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {payment.students?.name ||
                              payment.studentName ||
                              "Unknown Student"}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {payment.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-sm sm:text-base">
                          ₹{payment.amount?.toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "failed"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs mt-1"
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">Credit/Debit Card</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-neon-cyan"></div>
                      </div>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">Bank Transfer</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-neon-purple"></div>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">UPI</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-neon-green"></div>
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, payment ID, or amount..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 glass border-white/20 focus:border-primary/50"
              />
            </div>
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-full sm:w-48 glass border-white/20">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20 bg-card z-50">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="glass border-white/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Payment ID</TableHead>
                      <TableHead className="text-xs sm:text-sm">Student</TableHead>
                      <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                      <TableHead className="text-xs sm:text-sm">Method</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          {payment.id}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {payment.students?.name || payment.studentName || "Unknown"}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          ₹{payment.amount?.toLocaleString()}
                        </TableCell>
                        <TableCell className="capitalize text-xs sm:text-sm">
                          {payment.payment_method || payment.method || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "completed"
                                ? "default"
                                : payment.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString()
                            : payment.date || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emi" className="mt-6">
          <EMIManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentAnalytics data={analytics} />
            <EnhancedPaymentAnalytics data={analytics} />
          </div>
        </TabsContent>

        <TabsContent value="filters" className="mt-6">
          <PaymentFilters />
        </TabsContent>
      </Tabs>
    </div>
  );
};
