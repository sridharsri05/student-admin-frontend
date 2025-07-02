// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Users, Plus, Search, Filter, Download, Upload } from "lucide-react";
// import { StudentRegistrationForm } from "@/components/students/StudentRegistrationForm";
// import { StudentList } from "@/components/students/StudentList";
// import { BulkUpload } from "@/components/students/BulkUpload";

// export const Students = () => {
//   const [activeTab, setActiveTab] = useState("list");
//   const [searchTerm, setSearchTerm] = useState("");

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gradient flex items-center gap-2">
//             <Users className="w-8 h-8 text-neon-cyan" />
//             Student Management
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage student registrations, profiles, and enrollment
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             className="border-white/20 hover:bg-white/10"
//             onClick={() => setActiveTab("bulk")}
//           >
//             <Upload className="w-4 h-4 mr-2" />
//             Bulk Upload
//           </Button>
//           <Button
//             className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
//             onClick={() => setActiveTab("register")}
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Student
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="glass border-white/10 hover-lift">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Students</p>
//                 <p className="text-2xl font-bold text-neon-cyan">1,234</p>
//               </div>
//               <Badge className="bg-neon-cyan/20 text-neon-cyan">+12%</Badge>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="glass border-white/10 hover-lift">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Active Students</p>
//                 <p className="text-2xl font-bold text-neon-green">1,156</p>
//               </div>
//               <Badge className="bg-neon-green/20 text-neon-green">Active</Badge>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="glass border-white/10 hover-lift">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">New This Month</p>
//                 <p className="text-2xl font-bold text-neon-purple">78</p>
//               </div>
//               <Badge className="bg-neon-purple/20 text-neon-purple">New</Badge>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="glass border-white/10 hover-lift">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Pending Approval</p>
//                 <p className="text-2xl font-bold text-neon-pink">23</p>
//               </div>
//               <Badge className="bg-neon-pink/20 text-neon-pink">Pending</Badge>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="glass border-white/20">
//           <TabsTrigger value="list" className="data-[state=active]:bg-primary/20">
//             Student List
//           </TabsTrigger>
//           <TabsTrigger value="register" className="data-[state=active]:bg-primary/20">
//             Register New
//           </TabsTrigger>
//           <TabsTrigger value="bulk" className="data-[state=active]:bg-primary/20">
//             Bulk Upload
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="list" className="space-y-4">
//           {/* Search and Filter */}
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search students by name, email, or student ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 glass border-white/20 focus:border-primary/50"
//               />
//             </div>
//             <Button variant="outline" className="border-white/20 hover:bg-white/10">
//               <Filter className="w-4 h-4 mr-2" />
//               Filters
//             </Button>
//             <Button variant="outline" className="border-white/20 hover:bg-white/10">
//               <Download className="w-4 h-4 mr-2" />
//               Export
//             </Button>
//           </div>
//           <StudentList searchTerm={searchTerm} />
//         </TabsContent>

//         <TabsContent value="register">
//           <StudentRegistrationForm onSuccess={() => setActiveTab("list")} />
//         </TabsContent>

//         <TabsContent value="bulk">
//           <BulkUpload onSuccess={() => setActiveTab("list")} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Users,
  UserCheck,
  UserX,
  Clock,
  Eye,
  Edit,
  Trash2,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { StudentRegistrationForm } from "@/components/students/StudentRegistrationForm";
import { BulkUpload } from "@/components/students/BulkUpload";
import { useStudents } from "@/hooks/useStudents";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Students = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Handle navigation from dashboard
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const { students, loading, deleteStudent, updateStudent } = useStudents();

  // Mock students data (replace with real data from hook)
  const mockStudents = [
    {
      id: 1,
      name: "John Doe",
      email: "john@email.com",
      phone: "+91 9876543210",
      course: "React Development",
      batch: "Batch 1",
      status: "Active",
      joinDate: "2024-01-15",
      guardian: "Jane Doe",
      address: "123 Main St, Mumbai",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@email.com",
      phone: "+91 9876543211",
      course: "Node.js Mastery",
      batch: "Batch 2",
      status: "Active",
      joinDate: "2024-01-20",
      guardian: "John Smith",
      address: "456 Oak Ave, Delhi",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@email.com",
      phone: "+91 9876543212",
      course: "Full Stack",
      batch: "Batch 3",
      status: "Inactive",
      joinDate: "2023-12-10",
      guardian: "Sarah Johnson",
      address: "789 Pine St, Bangalore",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@email.com",
      phone: "+91 9876543213",
      course: "Python Development",
      batch: "Batch 1",
      status: "On Hold",
      joinDate: "2024-02-01",
      guardian: "Robert Davis",
      address: "321 Elm St, Chennai",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@email.com",
      phone: "+91 9876543214",
      course: "Java Programming",
      batch: "Batch 2",
      status: "Active",
      joinDate: "2024-01-25",
      guardian: "Lisa Wilson",
      address: "654 Maple Dr, Pune",
    },
  ];

  const stats = [
    {
      label: "Total Students",
      value: mockStudents.length,
      icon: Users,
      color: "text-neon-cyan",
    },
    {
      label: "Active Students",
      value: mockStudents.filter((s) => s.status === "Active").length,
      icon: UserCheck,
      color: "text-neon-green",
    },
    {
      label: "On Hold",
      value: mockStudents.filter((s) => s.status === "On Hold").length,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      label: "Inactive",
      value: mockStudents.filter((s) => s.status === "Inactive").length,
      icon: UserX,
      color: "text-red-400",
    },
  ];

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      searchTerm === "" ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.batch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      student.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handleView = (student) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditDialogOpen(true);
  };

  const handleDelete = async (studentId) => {
    try {
      await deleteStudent(studentId);
      toast({
        title: "Student Deleted",
        description: "Student has been successfully removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async (updatedData) => {
    try {
      await updateStudent(selectedStudent.id, updatedData);
      setEditDialogOpen(false);
      setSelectedStudent(null);
      toast({
        title: "Student Updated",
        description: "Student information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Phone",
        "Course",
        "Batch",
        "Status",
        "Join Date",
        "Guardian",
        "Address",
      ],
      ...filteredStudents.map((student) => [
        student.name,
        student.email,
        student.phone,
        student.course,
        student.batch,
        student.status,
        student.joinDate,
        student.guardian,
        student.address,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Student Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your students in one place
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="glass border-white/20 hover:bg-white/10"
            onClick={exportToCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            className="glass border-white/20 hover:bg-white/10"
            onClick={() => setActiveTab("bulk")}
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button
            className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
            onClick={() => setActiveTab("register")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass border-white/10 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass border-white/20">
          <TabsTrigger value="list" className="data-[state=active]:bg-primary/20">
            Student List
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-primary/20">
            Register New
          </TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-primary/20">
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filters */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-neon-cyan" />
                Search & Filter Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, course, batch..."
                    className="pl-10 glass border-white/20 focus:border-primary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className="glass border-white/20"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                    className="glass border-white/20"
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterStatus === "on hold" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("on hold")}
                    className="glass border-white/20"
                  >
                    On Hold
                  </Button>
                  <Button
                    variant={filterStatus === "inactive" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("inactive")}
                    className="glass border-white/20"
                  >
                    Inactive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass border-white/20 hover:bg-white/10"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Students List ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden sm:table-cell">Course</TableHead>
                      <TableHead className="hidden lg:table-cell">Batch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden xl:table-cell">Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{student.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {student.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {student.email}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div>
                            <p className="text-sm">{student.course}</p>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              {student.batch}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {student.batch}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "Active"
                                ? "default"
                                : student.status === "On Hold"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {student.joinDate}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="glass border-white/20 bg-card"
                            >
                              <DropdownMenuItem onClick={() => handleView(student)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(student)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="glass border-white/20">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently
                                      delete {student.name}'s record.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(student.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <StudentRegistrationForm />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkUpload />
        </TabsContent>
      </Tabs>

      {/* View Student Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="glass border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gradient">Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">Name</Label>
                  <p className="text-sm">{selectedStudent.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email</Label>
                  <p className="text-sm">{selectedStudent.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Phone</Label>
                  <p className="text-sm">{selectedStudent.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Course</Label>
                  <p className="text-sm">{selectedStudent.course}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">Batch</Label>
                  <p className="text-sm">{selectedStudent.batch}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Status</Label>
                  <Badge
                    variant={
                      selectedStudent.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {selectedStudent.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Join Date</Label>
                  <p className="text-sm">{selectedStudent.joinDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Guardian</Label>
                  <p className="text-sm">{selectedStudent.guardian}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold">Address</Label>
                <p className="text-sm">{selectedStudent.address}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="glass border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gradient">Edit Student</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <EditStudentForm
              student={selectedStudent}
              onSave={handleUpdateStudent}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Edit Student Form Component
const EditStudentForm = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone,
    course: student.course,
    batch: student.batch,
    status: student.status,
    guardian: student.guardian,
    address: student.address,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="glass border-white/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="glass border-white/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="glass border-white/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Input
            id="course"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className="glass border-white/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="batch">Batch</Label>
          <Input
            id="batch"
            value={formData.batch}
            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
            className="glass border-white/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="glass border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20 bg-card">
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="guardian">Guardian</Label>
          <Input
            id="guardian"
            value={formData.guardian}
            onChange={(e) => setFormData({ ...formData, guardian: e.target.value })}
            className="glass border-white/20"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="glass border-white/20"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-neon-cyan to-neon-purple">
          Save Changes
        </Button>
      </div>
    </form>
  );
};
