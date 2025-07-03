import { useStudents } from "@/hooks/useStudents";
import { Loader2, AlertCircle, Grid3X3, List, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  GraduationCap,
  User,
  Building,
  BookOpen,
  Clock,
  Globe
} from "lucide-react";
import { useState } from "react";
import EditStudentModal from "./EditStudentModal";

interface LookupItem {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  parentGuardian?: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  };
  status: string;
  university: LookupItem;
  course: LookupItem;
  coursePackage: LookupItem;
  semester: string;
  batchPreference: LookupItem;
  courseMode: LookupItem;
  nationality: LookupItem;
  feeStatus: string;
  photo: string | null;
  joinDate: string;
  createdAt: string;
  rollNumber: string;
}

interface StudentListProps {
  filteredStudents: Student[];
  viewMode: 'grid' | 'list';
}

export const StudentList = ({ filteredStudents, viewMode }: StudentListProps) => {
  const { loading, error, deleteStudent, updateStudent } = useStudents();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Helper to get name from object or fallback to ID
  const getName = (item: LookupItem | string | undefined) => {
    if (!item) return "-";
    if (typeof item === "string") return item;
    return item.name || item._id || "-";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "active-pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "inactive": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "pending": return "bg-neon-pink/20 text-neon-pink border-neon-pink/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleEdit = (student: Student) => setEditingStudent(student);
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-8 h-8 text-neon-cyan" />
        <span className="ml-3 text-neon-cyan">Loading students...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <span>Error loading students: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredStudents.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or add a new student.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredStudents.map((student: Student) => (
            <Card key={student._id} className="group glass border-white/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-neon-cyan/30 min-h-[500px]">
              <CardContent className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 shadow-lg ring-2 ring-white/10 group-hover:ring-neon-cyan/30 transition-all">
                      <AvatarImage src={student.photo || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-neon-purple text-white font-semibold">
                        {(student.name || "").split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground text-lg truncate">{student.name}</h3>
                      <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass bg-background border-white/20" align="end">
                      <DropdownMenuItem className="hover:bg-white/10" onClick={() => handleEdit(student)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Student
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10 text-red-400" onClick={() => handleDelete(student._id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">{student.city}, {student.state}</span>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">{getName(student.course)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">{getName(student.university)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{getName(student.batchPreference)}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Badge className={`${getStatusColor(student.status)} border`}>
                      {student.status}
                    </Badge>
                    <Badge className={`${getFeeStatusColor(student.feeStatus)} border`}>
                      {student.feeStatus}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getName(student.coursePackage)}
                  </div>
                </div>

                {/* Parent Info */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Parent/Guardian
                  </p>
                  <p className="text-sm font-medium">{student.parentGuardian?.name || "-"}</p>
                  <p className="text-xs text-muted-foreground">{student.parentGuardian?.phone || "-"}</p>
                  <p className="text-xs text-muted-foreground">{student.parentGuardian?.relationship || "-"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {filteredStudents.map((student: Student) => (
            <Card key={student._id} className="group glass border-white/10 hover:shadow-lg transition-all duration-300 hover:border-neon-cyan/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <Avatar className="w-10 h-10 shadow-md ring-2 ring-white/10 group-hover:ring-neon-cyan/30 transition-all">
                      <AvatarImage src={student.photo || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-neon-purple text-white text-sm">
                        {(student.name || "").split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{student.name}</h3>
                        <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                        <p className="text-xs text-muted-foreground">{student.phone}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground truncate">{getName(student.course)}</p>
                        <p className="text-xs text-muted-foreground">{getName(student.university)}</p>
                      </div>
                      <div className="min-w-0">
                        <div className="flex gap-2 mb-1">
                          <Badge className={`${getStatusColor(student.status)} border text-xs`}>
                            {student.status}
                          </Badge>
                          <Badge className={`${getFeeStatusColor(student.feeStatus)} border text-xs`}>
                            {student.feeStatus}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{getName(student.batchPreference)}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass bg-background border-white/20" align="end">
                      <DropdownMenuItem className="hover:bg-white/10" onClick={() => handleEdit(student)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Student
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10 text-red-400" onClick={() => handleDelete(student._id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onSave={async (updatedData) => {
            await updateStudent(editingStudent._id, updatedData);
            setEditingStudent(null);
          }}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
};
