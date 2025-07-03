import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  BookOpen,
  Clock,
  Globe,
  Save,
  X,
  Loader2
} from "lucide-react";
import { useLookups } from "@/hooks/useLookups";
import { toast } from "@/hooks/use-toast";

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

interface EditStudentModalProps {
  student: Student;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

const EditStudentModal = ({ student, onSave, onClose }: EditStudentModalProps) => {
  const [loading, setLoading] = useState(false);
  const { lookups } = useLookups();

  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone,
    dob: student.dob,
    gender: student.gender,
    address: student.address,
    city: student.city,
    state: student.state,
    pincode: student.pincode,
    parentGuardian: {
      name: student.parentGuardian?.name || "",
      phone: student.parentGuardian?.phone || "",
      email: student.parentGuardian?.email || "",
      relationship: student.parentGuardian?.relationship || ""
    },
    status: student.status,
    university: student.university._id,
    course: student.course._id,
    coursePackage: student.coursePackage._id,
    semester: student.semester,
    batchPreference: student.batchPreference._id,
    courseMode: student.courseMode._id,
    nationality: student.nationality._id,
    feeStatus: student.feeStatus
  });



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleParentChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      parentGuardian: { ...prev.parentGuardian, [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        parentGuardian: formData.parentGuardian,
        status: formData.status,
        university: formData.university,
        course: formData.course,
        coursePackage: formData.coursePackage,
        semester: formData.semester,
        batchPreference: formData.batchPreference,
        courseMode: formData.courseMode,
        nationality: formData.nationality,
        feeStatus: formData.feeStatus
      };

      await onSave(payload);
      toast({
        title: "Student Updated Successfully!",
        description: "The student information has been updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating the student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto glass border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient">
            <User className="w-5 h-5" />
            Edit Student
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Info Header */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
            <Avatar className="w-16 h-16 shadow-lg">
              <AvatarImage src={student.photo || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-neon-purple text-white text-lg font-semibold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{student.status}</Badge>
                <Badge variant="outline">{student.feeStatus}</Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 glass border-white/20">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Academic
              </TabsTrigger>
              <TabsTrigger value="parent" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Parent
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-4">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-neon-cyan">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="glass border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="glass border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="glass border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      className="glass border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange("gender", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => handleInputChange("nationality", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        {lookups.nationalities.map((nat: any) => (
                          <SelectItem key={nat._id} value={nat._id}>
                            {nat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Academic Information */}
            <TabsContent value="academic" className="space-y-4">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-neon-green">
                    <GraduationCap className="w-5 h-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University *</Label>
                    <Select
                      value={formData.university}
                      onValueChange={(value) => handleInputChange("university", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        {lookups.universities.map((uni: any) => (
                          <SelectItem key={uni._id} value={uni._id}>
                            {uni.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course *</Label>
                    <Select
                      value={formData.course}
                      onValueChange={(value) => handleInputChange("course", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        {lookups.courses.map((course: any) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coursePackage">Course Package *</Label>
                    <Select
                      value={formData.coursePackage}
                      onValueChange={(value) => handleInputChange("coursePackage", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select course package" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        {lookups.coursePackages.map((pkg: any) => (
                          <SelectItem key={pkg._id} value={pkg._id}>
                            {pkg.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester *</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => handleInputChange("semester", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            {sem}st Semester
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batchPreference">Batch Preference</Label>
                    <Select
                      value={formData.batchPreference}
                      onValueChange={(value) => handleInputChange("batchPreference", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select batch preference" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        {lookups.batches.map((batch: any) => (
                          <SelectItem key={batch._id} value={batch._id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseMode">Course Mode *</Label>
                    <Select
                      value={formData.courseMode}
                      onValueChange={(value) => handleInputChange("courseMode", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select course mode" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        {lookups.courseModes.map((mode: any) => (
                          <SelectItem key={mode._id} value={mode._id}>
                            {mode.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Parent Information */}
            <TabsContent value="parent" className="space-y-4">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-neon-purple">
                    <User className="w-5 h-5" />
                    Parent/Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                    <Input
                      id="parentName"
                      value={formData.parentGuardian.name}
                      onChange={(e) => handleParentChange("name", e.target.value)}
                      className="glass border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Parent/Guardian Phone *</Label>
                    <Input
                      id="parentPhone"
                      value={formData.parentGuardian.phone}
                      onChange={(e) => handleParentChange("phone", e.target.value)}
                      className="glass border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={formData.parentGuardian.email}
                      onChange={(e) => handleParentChange("email", e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select
                      value={formData.parentGuardian.relationship}
                      onValueChange={(value) => handleParentChange("relationship", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        <SelectItem value="Father">Father</SelectItem>
                        <SelectItem value="Mother">Mother</SelectItem>
                        <SelectItem value="Brother">Brother</SelectItem>
                        <SelectItem value="Sister">Sister</SelectItem>
                        <SelectItem value="Guardian">Guardian</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information */}
            <TabsContent value="contact" className="space-y-4">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-neon-pink">
                    <MapPin className="w-5 h-5" />
                    Contact & Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="glass border-white/20"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <BookOpen className="w-5 h-5" />
                    Status Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="active-pending">Active Pending</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feeStatus">Fee Status *</Label>
                    <Select
                      value={formData.feeStatus}
                      onValueChange={(value) => handleInputChange("feeStatus", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select fee status" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal; 