import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  X,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Grid3X3,
  List
} from "lucide-react";
import { StudentList } from "@/components/students/StudentList";
import { StudentListTable } from "@/components/students/StudentListTable";
import { StudentRegistrationForm } from "@/components/students/StudentRegistrationForm";
import { BulkUpload } from "@/components/students/BulkUpload";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/hooks/use-toast";
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'framer-motion';

export const Students = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>("list");
  const [filters, setFilters] = useState({
    status: "all",
    course: "all",
    university: "all",
    feeStatus: "all"
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { toast } = useToast();

  // Handle navigation from dashboard
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const { students, loading, deleteStudent, updateStudent, refreshStudents, lastFetch } = useStudents();

  // Calculate stats from real data
  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      color: "text-neon-cyan",
    },
    {
      label: "Active Students",
      value: students.filter((s) => s.status === "active").length,
      icon: UserCheck,
      color: "text-neon-green",
    },
    {
      label: "Pending",
      value: students.filter((s) => s.status === "pending").length,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      label: "Inactive",
      value: students.filter((s) => s.status === "inactive").length,
      icon: UserX,
      color: "text-red-400",
    },
  ];

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.rollNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.course?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === "all" || student.status === filters.status;
    const matchesCourse = filters.course === "all" || student.course?._id === filters.course;
    const matchesUniversity = filters.university === "all" || student.university?._id === filters.university;
    const matchesFeeStatus = filters.feeStatus === "all" || student.feeStatus === filters.feeStatus;

    return matchesSearch && matchesStatus && matchesCourse && matchesUniversity && matchesFeeStatus;
  });

  // Get unique values for filter options
  const uniqueCourses = [...new Set(students.map(s => s.course?._id).filter(Boolean))];
  const uniqueUniversities = [...new Set(students.map(s => s.university?._id).filter(Boolean))];

  const exportToCSV = () => {
    if (filteredStudents.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no students to export.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      [
        "Name",
        "Email",
        "Phone",
        "Roll Number",
        "Course",
        "University",
        "Batch",
        "Status",
        "Fee Status",
        "Join Date",
        "Guardian Name",
        "Guardian Phone",
        "Address",
        "City",
        "State"
      ],
      ...filteredStudents.map((student) => [
        student.name || "",
        student.email || "",
        student.phone || "",
        student.rollNumber || "",
        student.course?.name || "",
        student.university?.name || "",
        student.batchPreference?.name || "",
        student.status || "",
        student.feeStatus || "",
        student.joinDate ? new Date(student.joinDate).toLocaleDateString() : "",
        student.parentGuardian?.name || "",
        student.parentGuardian?.phone || "",
        student.address || "",
        student.city || "",
        student.state || ""
      ]),
    ]
      .map((row) => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `${filteredStudents.length} students exported to CSV.`,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      course: "all",
      university: "all",
      feeStatus: "all"
    });
    setSearchTerm("");
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== "all") || searchTerm;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-neon-cyan" />
            Student Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage student registrations, profiles, and enrollment
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/10"
            onClick={() => setActiveTab("bulk")}
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </Button>
          <Button
            className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
            onClick={() => setActiveTab("register")}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Student</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={`stat-${index}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
          >
            <Card className="glass border-white/10 hover-lift">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                    <p className={`text-lg sm:text-2xl font-bold ${stat.color} truncate`}>
                      <CountUp end={stat.value} duration={1.2} />
                    </p>
                  </div>
                  <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} flex-shrink-0`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass border-white/20 w-full grid grid-cols-3">
          <TabsTrigger value="list" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm">
            Student List
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm">
            Register New
          </TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm">
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <TabsContent value="list" className="space-y-4" forceMount>
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students by name, email, or student ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass border-white/20 focus:border-primary/50 text-sm"
                    />
                  </div>
                  
                  {/* Filter Button for Mobile */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="border-white/20 hover:bg-white/10 sm:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="glass border-white/20">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Status</label>
                          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="glass border-white/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass bg-background border-white/20">
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="graduated">Graduated</SelectItem>
                              <SelectItem value="dropped">Dropped</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Fee Status</label>
                          <Select value={filters.feeStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, feeStatus: value }))}>
                            <SelectTrigger className="glass border-white/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass bg-background border-white/20">
                              <SelectItem value="all">All Fee Status</SelectItem>
                              <SelectItem value="complete">Complete</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Course</label>
                          <Select value={filters.course} onValueChange={(value) => setFilters(prev => ({ ...prev, course: value }))}>
                            <SelectTrigger className="glass border-white/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass bg-background border-white/20">
                              <SelectItem value="all">All Courses</SelectItem>
                              {uniqueCourses.map(courseId => {
                                const courseIdStr = String(courseId);
                                const course = students.find(s => s.course?._id === courseId)?.course;
                                return (
                                  <SelectItem key={courseIdStr} value={courseIdStr}>
                                    {course?.name || courseIdStr}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">University</label>
                          <Select value={filters.university} onValueChange={(value) => setFilters(prev => ({ ...prev, university: value }))}>
                            <SelectTrigger className="glass border-white/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass bg-background border-white/20">
                              <SelectItem value="all">All Universities</SelectItem>
                              {uniqueUniversities.map(uniId => {
                                const uniIdStr = String(uniId);
                                const university = students.find(s => s.university?._id === uniId)?.university;
                                return (
                                  <SelectItem key={uniIdStr} value={uniIdStr}>
                                    {university?.name || uniIdStr}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className="w-full border-white/20 hover:bg-white/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Desktop Filter Controls */}
                  <div className="hidden sm:flex items-center gap-2">
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="w-32 glass border-white/20">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filters.feeStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, feeStatus: value }))}>
                      <SelectTrigger className="w-32 glass border-white/20">
                        <SelectValue placeholder="Fee Status" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        <SelectItem value="all">All Fee Status</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={clearFilters}
                        className="border-white/20 hover:bg-white/10"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={exportToCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 hover:bg-white/10" 
                    onClick={() => refreshStudents()}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                </div>

                {/* Results Count and View Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                  <div className="text-sm text-muted-foreground order-2 sm:order-1 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <span>Showing {filteredStudents.length} of {students.length} students</span>
                      {hasActiveFilters && (
                        <Badge variant="outline">
                          Filtered
                        </Badge>
                      )}
                    </div>
                    {lastFetch && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Last updated: {new Date(lastFetch).toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-end">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="flex items-center gap-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="flex items-center gap-2"
                    >
                      <List className="w-4 h-4" />
                      List
                    </Button>
                  </div>
                </div>
                
                {/* Student List Display */}
                <StudentList filteredStudents={filteredStudents} viewMode={viewMode} refreshStudents={refreshStudents} />
              </TabsContent>
            </motion.div>
          )}
          {activeTab === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <TabsContent value="register" forceMount>
                <StudentRegistrationForm onSuccess={(studentData) => {
                  // First refresh the students list to include the new student
                  refreshStudents();
                  
                  // If we have student data, ask if they want to add fee details now
                  if (studentData && studentData._id) {
                    // Show toast with success and option to add fee
                    toast({
                      title: "Student Registration Successful",
                      description: (
                        <div className="space-y-2">
                          <p>The student has been registered successfully.</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => setActiveTab("list")}>
                              View Students
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                // Navigate to fee payment page with the student data
                                window.location.href = `/payment-reports?student=${studentData._id}`;
                              }}
                            >
                              Add Fee Details
                            </Button>
                          </div>
                        </div>
                      ),
                      duration: 8000,
                    });
                  } else {
                    // Default back to the list view
                    setActiveTab("list");
                  }
                }} />
              </TabsContent>
            </motion.div>
          )}
          {activeTab === "bulk" && (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <TabsContent value="bulk" forceMount>
                <BulkUpload onSuccess={() => setActiveTab("list")} />
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
