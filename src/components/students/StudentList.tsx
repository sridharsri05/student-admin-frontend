
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  GraduationCap
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  batch: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  university: string;
  semester: string;
  photo: string;
  address: string;
  parentName: string;
  parentPhone: string;
  feeStatus: "paid" | "pending" | "overdue";
}

interface StudentListProps {
  searchTerm: string;
}

export const StudentList = ({ searchTerm }: StudentListProps) => {
  // Mock data - in real app, this would come from an API
  const [students] = useState<Student[]>([
    {
      id: "STU001",
      name: "Raj Patel",
      email: "raj.patel@email.com",
      phone: "+91 9876543210",
      course: "JEE Main Preparation",
      batch: "Morning Batch",
      status: "active",
      joinDate: "2024-01-15",
      university: "Mumbai University",
      semester: "2nd Year",
      photo: "",
      address: "Mumbai, Maharashtra",
      parentName: "Ramesh Patel",
      parentPhone: "+91 9876543211",
      feeStatus: "paid"
    },
    {
      id: "STU002",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 9876543212",
      course: "NEET Preparation",
      batch: "Evening Batch",
      status: "active",
      joinDate: "2024-02-01",
      university: "Delhi University",
      semester: "1st Year",
      photo: "",
      address: "Delhi, India",
      parentName: "Suresh Sharma",
      parentPhone: "+91 9876543213",
      feeStatus: "pending"
    },
    {
      id: "STU003",
      name: "Arjun Singh",
      email: "arjun.singh@email.com",
      phone: "+91 9876543214",
      course: "Board Exam Preparation",
      batch: "Afternoon Batch",
      status: "pending",
      joinDate: "2024-03-10",
      university: "Pune University",
      semester: "3rd Year",
      photo: "",
      address: "Pune, Maharashtra",
      parentName: "Vikram Singh",
      parentPhone: "+91 9876543215",
      feeStatus: "overdue"
    }
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-neon-green/20 text-neon-green";
      case "inactive": return "bg-gray-500/20 text-gray-400";
      case "pending": return "bg-neon-pink/20 text-neon-pink";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-neon-green/20 text-neon-green";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "overdue": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      {filteredStudents.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No students found matching your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="glass border-white/10 hover-lift hover-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={student.photo} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-neon-purple text-white">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.id}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass bg-background border-white/20">
                      <DropdownMenuItem className="hover:bg-white/10">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Student
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10 text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{student.course}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{student.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Joined: {new Date(student.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                    <Badge className={getFeeStatusColor(student.feeStatus)}>
                      {student.feeStatus}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {student.batch}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Parent/Guardian:</p>
                  <p className="text-sm font-medium">{student.parentName}</p>
                  <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
