import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Download,
  FileText,
  Calendar as CalendarIcon,
  Filter,
  Users,
  CreditCard,
  BookOpen,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Building2,
  FileCheck,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

export const FullReports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [reportType, setReportType] = useState("all");
  const [exportFormat, setExportFormat] = useState("pdf");

  // Mock data - replace with real API calls
  const reportData = {
    students: [
      {
        id: 1,
        name: "John Doe",
        email: "john@email.com",
        course: "React Development",
        status: "Active",
        joinDate: "2024-01-15",
        totalPaid: 15000,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@email.com",
        course: "Node.js Mastery",
        status: "Active",
        joinDate: "2024-01-20",
        totalPaid: 12000,
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@email.com",
        course: "Full Stack",
        status: "Completed",
        joinDate: "2023-12-10",
        totalPaid: 25000,
      },
    ],
    payments: [
      {
        id: 1,
        studentName: "John Doe",
        amount: 5000,
        method: "Card",
        status: "Completed",
        date: "2024-01-15",
        course: "React Development",
      },
      {
        id: 2,
        studentName: "Jane Smith",
        amount: 4000,
        method: "UPI",
        status: "Completed",
        date: "2024-01-20",
        course: "Node.js Mastery",
      },
      {
        id: 3,
        studentName: "Mike Johnson",
        amount: 8000,
        method: "Bank Transfer",
        status: "Completed",
        date: "2024-01-10",
        course: "Full Stack",
      },
    ],
    batches: [
      {
        id: 1,
        name: "React Batch 1",
        course: "React Development",
        students: 25,
        startDate: "2024-01-15",
        status: "Active",
      },
      {
        id: 2,
        name: "Node Batch 1",
        course: "Node.js Mastery",
        students: 18,
        startDate: "2024-01-20",
        status: "Active",
      },
      {
        id: 3,
        name: "Full Stack Batch 1",
        course: "Full Stack",
        students: 30,
        startDate: "2023-12-01",
        status: "Completed",
      },
    ],
    summary: {
      totalStudents: 73,
      activeStudents: 43,
      totalRevenue: 125000,
      pendingPayments: 15000,
      activeBatches: 5,
      completedBatches: 3,
    },
  };

  const handleExportPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const doc = new jsPDF();

      // Enterprise Header with Logo Area
      doc.setFillColor(15, 23, 42); // Dark blue background
      doc.rect(0, 0, 210, 40, "F");

      // Company Name
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("EduFlow Academy", 20, 25);

      // Report Title
      doc.setFontSize(14);
      doc.setTextColor(168, 85, 247); // Purple accent
      doc.text("COMPREHENSIVE BUSINESS REPORT", 20, 32);

      // Report Metadata Box
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 45, 180, 25, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 45, 180, 25, "S");

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text("Report Generated:", 20, 55);
      doc.text(format(new Date(), "PPP pp"), 20, 62);

      if (dateRange.from && dateRange.to) {
        doc.text("Analysis Period:", 110, 55);
        doc.text(
          `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`,
          110,
          62
        );
      }

      // Executive Summary Section
      doc.setFillColor(59, 130, 246);
      doc.rect(15, 75, 180, 8, "F");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("EXECUTIVE SUMMARY", 20, 81);

      // Key Metrics Grid
      let yPos = 90;
      const metrics = [
        {
          label: "Total Students Enrolled",
          value: reportData.summary.totalStudents.toString(),
          icon: "👥",
        },
        {
          label: "Active Learners",
          value: reportData.summary.activeStudents.toString(),
          icon: "✅",
        },
        {
          label: "Total Revenue Generated",
          value: `₹${reportData.summary.totalRevenue.toLocaleString()}`,
          icon: "💰",
        },
        {
          label: "Outstanding Payments",
          value: `₹${reportData.summary.pendingPayments.toLocaleString()}`,
          icon: "⏳",
        },
        {
          label: "Active Training Batches",
          value: reportData.summary.activeBatches.toString(),
          icon: "📚",
        },
        {
          label: "Completed Programs",
          value: reportData.summary.completedBatches.toString(),
          icon: "🎓",
        },
      ];

      metrics.forEach((metric, index) => {
        const xPos = (index % 2) * 90 + 20;
        const currentY = yPos + Math.floor(index / 2) * 18;

        doc.setFillColor(249, 250, 251);
        doc.rect(xPos - 3, currentY - 5, 85, 15, "F");
        doc.setDrawColor(229, 231, 235);
        doc.rect(xPos - 3, currentY - 5, 85, 15, "S");

        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text(metric.label, xPos, currentY);

        doc.setFontSize(12);
        doc.setTextColor(17, 24, 39);
        doc.text(metric.value, xPos, currentY + 7);
      });

      yPos += 60;

      // Detailed Sections
      if (reportType === "all" || reportType === "students") {
        // Students Analysis Section
        doc.setFillColor(34, 197, 94);
        doc.rect(15, yPos, 180, 8, "F");
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text("STUDENT ENROLLMENT ANALYSIS", 20, yPos + 6);

        yPos += 15;

        // Table Header
        doc.setFillColor(243, 244, 246);
        doc.rect(15, yPos, 180, 8, "F");
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        doc.text("Student Name", 20, yPos + 5);
        doc.text("Program", 70, yPos + 5);
        doc.text("Status", 120, yPos + 5);
        doc.text("Revenue", 160, yPos + 5);

        yPos += 8;

        reportData.students.forEach((student, index) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }

          const bgColor = index % 2 === 0 ? [255, 255, 255] : [249, 250, 251];
          doc.setFillColor(...bgColor);
          doc.rect(15, yPos, 180, 8, "F");

          doc.setFontSize(8);
          doc.setTextColor(17, 24, 39);
          doc.text(student.name, 20, yPos + 5);
          doc.text(student.course.substring(0, 20), 70, yPos + 5);

          // Status with color coding
          const statusColor =
            student.status === "Active" ? [34, 197, 94] : [107, 114, 128];
          doc.setTextColor(...statusColor);
          doc.text(student.status, 120, yPos + 5);

          doc.setTextColor(17, 24, 39);
          doc.text(`₹${student.totalPaid.toLocaleString()}`, 160, yPos + 5);

          yPos += 8;
        });

        yPos += 10;
      }

      // Financial Summary
      if (reportType === "all" || reportType === "payments") {
        if (yPos > 200) {
          doc.addPage();
          yPos = 30;
        }

        doc.setFillColor(168, 85, 247);
        doc.rect(15, yPos, 180, 8, "F");
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text("FINANCIAL PERFORMANCE OVERVIEW", 20, yPos + 6);

        yPos += 15;

        // Payment method breakdown
        const paymentMethods = { Card: 45, UPI: 30, "Bank Transfer": 25 };
        Object.entries(paymentMethods).forEach(([method, percentage]) => {
          doc.setFillColor(243, 244, 246);
          doc.rect(20, yPos, 160, 6, "F");
          doc.setFillColor(59, 130, 246);
          doc.rect(20, yPos, (160 * percentage) / 100, 6, "F");

          doc.setFontSize(9);
          doc.setTextColor(17, 24, 39);
          doc.text(`${method}: ${percentage}%`, 25, yPos + 4);

          yPos += 10;
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text("Generated by EduFlow Academy Management System", 20, 280);
      doc.text(`Page 1 | Confidential & Proprietary`, 140, 280);

      doc.save(`eduflow-enterprise-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);

      toast({
        title: "Enterprise PDF Report Generated",
        description:
          "Your comprehensive business report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();

      // Executive Summary Sheet with enhanced formatting
      const summaryData = [
        ["EDUFLOW ACADEMY - BUSINESS INTELLIGENCE REPORT"],
        [""],
        ["Report Metadata"],
        ["Generated Date", format(new Date(), "PPP")],
        ["Generated Time", format(new Date(), "pp")],
        ["Report Type", reportType.toUpperCase()],
        [""],
        ["EXECUTIVE SUMMARY"],
        [""],
        ["Key Performance Indicators", "Current Value", "Status"],
        ["Total Students Enrolled", reportData.summary.totalStudents, "Active"],
        ["Active Learning Population", reportData.summary.activeStudents, "Engaged"],
        ["Total Revenue Generated (₹)", reportData.summary.totalRevenue, "Positive"],
        [
          "Outstanding Receivables (₹)",
          reportData.summary.pendingPayments,
          "Follow-up Required",
        ],
        ["Active Training Batches", reportData.summary.activeBatches, "Operational"],
        ["Completed Programs", reportData.summary.completedBatches, "Successful"],
        [""],
        ["Financial Metrics"],
        [
          "Revenue per Student (₹)",
          Math.round(reportData.summary.totalRevenue / reportData.summary.totalStudents),
        ],
        [
          "Collection Efficiency (%)",
          Math.round(
            ((reportData.summary.totalRevenue - reportData.summary.pendingPayments) /
              reportData.summary.totalRevenue) *
              100
          ),
        ],
        [
          "Active Batch Utilization",
          `${Math.round(
            (reportData.summary.activeStudents /
              (reportData.summary.activeBatches * 25)) *
              100
          )}%`,
        ],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

      // Apply formatting to summary sheet
      summarySheet["!cols"] = [{ width: 35 }, { width: 20 }, { width: 25 }];

      XLSX.utils.book_append_sheet(workbook, summarySheet, "Executive Summary");

      // Enhanced Students Sheet
      if (reportType === "all" || reportType === "students") {
        const studentsData = [
          ["STUDENT ENROLLMENT ANALYSIS"],
          [""],
          [
            "Student ID",
            "Full Name",
            "Email Address",
            "Enrolled Program",
            "Enrollment Status",
            "Join Date",
            "Total Fees Paid (₹)",
            "Outstanding Amount (₹)",
          ],
        ];

        reportData.students.forEach((student) => {
          studentsData.push([
            `STU-${student.id.toString().padStart(4, "0")}`,
            student.name,
            student.email,
            student.course,
            student.status,
            student.joinDate,
            student.totalPaid,
            student.status === "Active" ? student.totalPaid * 0.2 : 0, // Mock outstanding
          ]);
        });

        // Add summary rows
        studentsData.push(
          [""],
          ["SUMMARY STATISTICS"],
          ["Total Students", reportData.students.length],
          [
            "Active Students",
            reportData.students.filter((s) => s.status === "Active").length,
          ],
          [
            "Total Revenue (₹)",
            reportData.students.reduce((sum, s) => sum + s.totalPaid, 0),
          ],
          [
            "Average Revenue per Student (₹)",
            Math.round(
              reportData.students.reduce((sum, s) => sum + s.totalPaid, 0) /
                reportData.students.length
            ),
          ]
        );

        const studentsSheet = XLSX.utils.aoa_to_sheet(studentsData);
        studentsSheet["!cols"] = [
          { width: 12 },
          { width: 20 },
          { width: 25 },
          { width: 20 },
          { width: 15 },
          { width: 12 },
          { width: 15 },
          { width: 18 },
        ];

        XLSX.utils.book_append_sheet(workbook, studentsSheet, "Student Analysis");
      }

      // Enhanced Payments Sheet
      if (reportType === "all" || reportType === "payments") {
        const paymentsData = [
          ["FINANCIAL TRANSACTION ANALYSIS"],
          [""],
          [
            "Transaction ID",
            "Student Name",
            "Amount (₹)",
            "Payment Method",
            "Course/Program",
            "Transaction Date",
            "Status",
            "Processing Fee (₹)",
            "Net Amount (₹)",
          ],
        ];

        reportData.payments.forEach((payment) => {
          const processingFee = Math.round(payment.amount * 0.02); // 2% processing fee
          paymentsData.push([
            `TXN-${payment.id.toString().padStart(6, "0")}`,
            payment.studentName,
            payment.amount,
            payment.method,
            payment.course,
            payment.date,
            payment.status,
            processingFee,
            payment.amount - processingFee,
          ]);
        });

        // Add financial summary
        paymentsData.push(
          [""],
          ["FINANCIAL SUMMARY"],
          ["Total Transactions", reportData.payments.length],
          [
            "Gross Revenue (₹)",
            reportData.payments.reduce((sum, p) => sum + p.amount, 0),
          ],
          [
            "Total Processing Fees (₹)",
            reportData.payments.reduce((sum, p) => sum + Math.round(p.amount * 0.02), 0),
          ],
          [
            "Net Revenue (₹)",
            reportData.payments.reduce(
              (sum, p) => sum + (p.amount - Math.round(p.amount * 0.02)),
              0
            ),
          ]
        );

        const paymentsSheet = XLSX.utils.aoa_to_sheet(paymentsData);
        paymentsSheet["!cols"] = [
          { width: 15 },
          { width: 20 },
          { width: 12 },
          { width: 15 },
          { width: 20 },
          { width: 15 },
          { width: 12 },
          { width: 15 },
          { width: 15 },
        ];

        XLSX.utils.book_append_sheet(workbook, paymentsSheet, "Financial Analysis");
      }

      // Enhanced Batches Sheet
      if (reportType === "all" || reportType === "batches") {
        const batchesData = [
          ["BATCH PERFORMANCE ANALYSIS"],
          [""],
          [
            "Batch Code",
            "Batch Name",
            "Program/Course",
            "Enrolled Students",
            "Capacity",
            "Utilization %",
            "Start Date",
            "Status",
            "Revenue per Batch (₹)",
          ],
        ];

        reportData.batches.forEach((batch) => {
          const capacity = 30; // Mock capacity
          const utilization = Math.round((batch.students / capacity) * 100);
          const revenuePerBatch = batch.students * 15000; // Mock calculation

          batchesData.push([
            `BATCH-${batch.id.toString().padStart(3, "0")}`,
            batch.name,
            batch.course,
            batch.students,
            capacity,
            utilization,
            batch.startDate,
            batch.status,
            revenuePerBatch,
          ]);
        });

        // Add batch analytics
        batchesData.push(
          [""],
          ["BATCH ANALYTICS"],
          ["Total Batches", reportData.batches.length],
          [
            "Average Students per Batch",
            Math.round(
              reportData.batches.reduce((sum, b) => sum + b.students, 0) /
                reportData.batches.length
            ),
          ],
          [
            "Total Batch Revenue (₹)",
            reportData.batches.reduce((sum, b) => sum + b.students * 15000, 0),
          ],
          [
            "Average Batch Utilization %",
            Math.round(
              reportData.batches.reduce((sum, b) => sum + (b.students / 30) * 100, 0) /
                reportData.batches.length
            ),
          ]
        );

        const batchesSheet = XLSX.utils.aoa_to_sheet(batchesData);
        batchesSheet["!cols"] = [
          { width: 12 },
          { width: 20 },
          { width: 18 },
          { width: 15 },
          { width: 10 },
          { width: 12 },
          { width: 12 },
          { width: 12 },
          { width: 18 },
        ];

        XLSX.utils.book_append_sheet(workbook, batchesSheet, "Batch Performance");
      }

      XLSX.writeFile(
        workbook,
        `eduflow-business-intelligence-${format(new Date(), "yyyy-MM-dd")}.xlsx`
      );

      toast({
        title: "Business Intelligence Report Generated",
        description:
          "Your enhanced Excel report with detailed analytics has been downloaded.",
      });
    } catch (error) {
      console.error("Excel generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate Excel report.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (exportFormat === "pdf") {
      handleExportPDF();
    } else {
      handleExportExcel();
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient flex items-center gap-3">
            <Building2 className="w-10 h-10 text-neon-green" />
            Business Intelligence Reports
          </h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive analytics and enterprise-grade reporting
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="glass border-white/20 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20 bg-card">
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Enterprise PDF
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Business Excel
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80 px-6"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="glass border-white/10 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Report Scope</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/20 bg-card">
                  <SelectItem value="all">📊 Complete Business Report</SelectItem>
                  <SelectItem value="students">👥 Student Analytics Only</SelectItem>
                  <SelectItem value="payments">💰 Financial Analysis Only</SelectItem>
                  <SelectItem value="batches">📚 Batch Performance Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full glass border-white/20 justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 glass border-white/20"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full glass border-white/20 justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 glass border-white/20"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Actions</Label>
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10"
                onClick={() => setDateRange({ from: null, to: null })}
              >
                <Filter className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: "Total Students",
            value: reportData.summary.totalStudents,
            icon: Users,
            color: "text-neon-blue",
            bg: "bg-neon-blue/10",
          },
          {
            label: "Active Learners",
            value: reportData.summary.activeStudents,
            icon: UserCheck,
            color: "text-neon-green",
            bg: "bg-neon-green/10",
          },
          {
            label: "Revenue (₹)",
            value: `${(reportData.summary.totalRevenue / 1000).toFixed(0)}K`,
            icon: CreditCard,
            color: "text-neon-cyan",
            bg: "bg-neon-cyan/10",
          },
          {
            label: "Pending (₹)",
            value: `${(reportData.summary.pendingPayments / 1000).toFixed(0)}K`,
            icon: TrendingUp,
            color: "text-neon-pink",
            bg: "bg-neon-pink/10",
          },
          {
            label: "Active Batches",
            value: reportData.summary.activeBatches,
            icon: BookOpen,
            color: "text-neon-purple",
            bg: "bg-neon-purple/10",
          },
          {
            label: "Completed",
            value: reportData.summary.completedBatches,
            icon: FileCheck,
            color: "text-neon-orange",
            bg: "bg-neon-orange/10",
          },
        ].map((stat, index) => (
          <Card key={index} className="glass border-white/10 hover-lift shadow-lg">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div
                  className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mx-auto`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Column-based Tabs Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Navigation Column */}
        <Card className="glass border-white/10 xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-gradient flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Report Sections
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {[
                { id: "overview", label: "Executive Overview", icon: TrendingUp },
                { id: "students", label: "Student Analytics", icon: Users },
                { id: "payments", label: "Financial Analysis", icon: CreditCard },
                { id: "batches", label: "Batch Performance", icon: BookOpen },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 px-6 py-3 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan border-neon-cyan/50"
                      : "hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Column */}
        <div className="xl:col-span-3">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="text-gradient">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg glass border border-white/10">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-neon-green" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              New Student Registration
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              John Doe joined React Development
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-neon-green/20 text-neon-green text-xs">
                          Today
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg glass border border-white/10">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-neon-cyan" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              Payment Received
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              ₹5,000 from Jane Smith
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-neon-cyan/20 text-neon-cyan text-xs">
                          2h ago
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg glass border border-white/10">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-neon-purple" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              Batch Completed
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Full Stack Batch 1 finished
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-neon-purple/20 text-neon-purple text-xs">
                          1d ago
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="text-gradient">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">
                          Student Retention Rate
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-5/6 h-full bg-neon-green"></div>
                          </div>
                          <span className="text-sm font-medium">88%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">Payment Success Rate</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-11/12 h-full bg-neon-cyan"></div>
                          </div>
                          <span className="text-sm font-medium">96%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">Course Completion</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-neon-purple"></div>
                          </div>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">Monthly Growth</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-neon-pink"></div>
                          </div>
                          <span className="text-sm font-medium">23%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient">
                  Student Enrollment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead className="hidden md:table-cell">Join Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Revenue (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {student.email}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {student.course}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {student.joinDate}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "Active" ? "default" : "secondary"
                              }
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{student.totalPaid.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "payments" && (
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient">
                  Financial Transaction Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">Method</TableHead>
                        <TableHead className="hidden md:table-cell">Program</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.studentName}
                          </TableCell>
                          <TableCell className="font-medium">
                            ₹{payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {payment.method}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                            {payment.course}
                          </TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>
                            <Badge variant="default">{payment.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "batches" && (
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-gradient">
                  Batch Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch Name</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead className="hidden sm:table-cell">Students</TableHead>
                        <TableHead className="hidden md:table-cell">Start Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.batches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell className="font-medium">{batch.name}</TableCell>
                          <TableCell>{batch.course}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {batch.students}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {batch.startDate}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                batch.status === "Active" ? "default" : "secondary"
                              }
                            >
                              {batch.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
