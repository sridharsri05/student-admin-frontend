import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useLookups } from "@/hooks/useLookups";

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
  status: 'active' | 'inactive' | 'pending' | 'graduated' | 'dropped';
  university: any;
  course: any;
  coursePackage: any;
  semester: string;
  batchPreference: any;
  courseMode: any;
  nationality: any;
  feeStatus: 'pending' | 'partial' | 'complete' | 'overdue';
  totalFees: number;
  paidAmount: number;
  remainingAmount: number;
  nextPaymentDue?: string;
  photo: string | null;
  joinDate: string;
  rollNumber: string;
}

interface EditStudentModalProps {
  student: Student;
  onSave: (updatedData: any) => Promise<void>;
  onClose: () => void;
}

const EditStudentModal = ({ student, onSave, onClose }: EditStudentModalProps) => {
  const { lookups } = useLookups();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Split the name into first and last name
  const nameParts = student.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const [formData, setFormData] = useState({
    // Personal Information
    firstName,
    lastName,
    email: student.email || "",
    phone: student.phone || "",
    dateOfBirth: student.dob || "",
    gender: student.gender || "",
    address: student.address || "",
    city: student.city || "",
    state: student.state || "",
    pincode: student.pincode || "",
    status: student.status || "",
    nationality: student.nationality?._id || "",

    // Parent/Guardian Information
    parentName: student.parentGuardian?.name || "",
    parentPhone: student.parentGuardian?.phone || "",
    parentEmail: student.parentGuardian?.email || "",
    relationship: student.parentGuardian?.relationship || "",

    // Academic Information
    university: student.university?._id || "",
    course: student.course?._id || "",
    semester: student.semester || "",
    rollNumber: student.rollNumber || "",
    coursePackage: student.coursePackage?._id || "",
    batchPreference: student.batchPreference?._id || "",
    courseMode: student.courseMode?._id || "",
    
    // Fee Information
    totalFees: student.totalFees?.toString() || "",
    paidAmount: student.paidAmount?.toString() || "",
    remainingAmount: student.remainingAmount?.toString() || "",
    feeStatus: student.feeStatus || "",
    nextPaymentDue: student.nextPaymentDue || "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Phone validation: only allow digits and max 10 digits
    if (field === "phone" || field === "parentPhone") {
      // Remove non-digits
      value = value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
    }
    
    // Calculate remaining amount when totalFees or paidAmount changes
    if (field === "totalFees" || field === "paidAmount") {
      const totalFees = field === "totalFees" ? parseFloat(value) || 0 : parseFloat(formData.totalFees) || 0;
      const paidAmount = field === "paidAmount" ? parseFloat(value) || 0 : parseFloat(formData.paidAmount) || 0;
      const remainingAmount = Math.max(0, totalFees - paidAmount).toString();
      
    setFormData(prev => ({
      ...prev,
        [field]: value,
        remainingAmount: remainingAmount
    }));
      return;
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare payload matching backend schema
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        status: formData.status,
        parentGuardian: {
          name: formData.parentName,
          phone: formData.parentPhone,
          email: formData.parentEmail,
          relationship: formData.relationship,
        },
        university: formData.university,
        course: formData.course,
        coursePackage: formData.coursePackage,
        semester: formData.semester,
        batchPreference: formData.batchPreference,
        courseMode: formData.courseMode,
        nationality: formData.nationality,
        feeStatus: formData.feeStatus,
        totalFees: parseFloat(formData.totalFees) || 0,
        paidAmount: parseFloat(formData.paidAmount) || 0,
        nextPaymentDue: formData.nextPaymentDue || null,
      };

      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={() => onClose()}>
      <DialogContent className="glass border-white/10 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gradient">Edit Student</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass border-white/20 w-full grid grid-cols-4">
              <TabsTrigger value="personal" className="data-[state=active]:bg-primary/20">
                Personal
              </TabsTrigger>
              <TabsTrigger value="academic" className="data-[state=active]:bg-primary/20">
                Academic
              </TabsTrigger>
              <TabsTrigger value="guardian" className="data-[state=active]:bg-primary/20">
                Guardian
              </TabsTrigger>
              <TabsTrigger value="fees" className="data-[state=active]:bg-primary/20">
                Fees
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="glass border-white/20"
                    required
                  />
                </div>
                  <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                    <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="glass border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="glass border-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal glass border-white/20 ${
                          !formData.dateOfBirth ? "text-muted-foreground" : ""
                        }`}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.dateOfBirth
                          ? format(new Date(formData.dateOfBirth), "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                        onSelect={(date) => {
                          handleInputChange(
                            "dateOfBirth",
                            date ? date.toISOString().split("T")[0] : ""
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
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
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="glass border-white/20"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="glass border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="glass border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    className="glass border-white/20"
                  />
                </div>
                  <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                    <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                      <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
            </TabsContent>

            {/* Academic Information */}
            <TabsContent value="academic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="university">University/College</Label>
                    <Select
                      value={formData.university}
                      onValueChange={(value) => handleInputChange("university", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                      {lookups.universities?.map((uni) => (
                          <SelectItem key={uni._id} value={uni._id}>
                          {uni?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                    <Select
                      value={formData.course}
                      onValueChange={(value) => handleInputChange("course", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                      {lookups.courses?.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                          {course?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="semester">Semester/Year</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => handleInputChange("semester", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                      <SelectItem value="1">1st Semester</SelectItem>
                      <SelectItem value="2">2nd Semester</SelectItem>
                      <SelectItem value="3">3rd Semester</SelectItem>
                      <SelectItem value="4">4th Semester</SelectItem>
                      <SelectItem value="5">5th Semester</SelectItem>
                      <SelectItem value="6">6th Semester</SelectItem>
                      <SelectItem value="7">7th Semester</SelectItem>
                      <SelectItem value="8">8th Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    value={formData.rollNumber}
                    className="glass border-white/20"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coursePackage">Course Package</Label>
                  <Select
                    value={formData.coursePackage}
                    onValueChange={(value) => handleInputChange("coursePackage", value)}
                  >
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent className="glass bg-background border-white/20">
                      {lookups.coursePackages?.map((pkg) => (
                        <SelectItem key={pkg._id} value={pkg._id}>
                          {pkg?.name}
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
                      <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                      {lookups.batches?.map((batch) => (
                          <SelectItem key={batch._id} value={batch._id}>
                          {batch?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="courseMode">Course Mode</Label>
                    <Select
                      value={formData.courseMode}
                      onValueChange={(value) => handleInputChange("courseMode", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                      {lookups.courseModes?.map((mode) => (
                          <SelectItem key={mode._id} value={mode._id}>
                          {mode?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => handleInputChange("nationality", value)}
                  >
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent className="glass bg-background border-white/20">
                      {lookups.nationalities?.map((nat) => (
                        <SelectItem key={nat._id} value={nat._id}>
                          {nat?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              </div>
            </TabsContent>

            {/* Guardian Information */}
            <TabsContent value="guardian" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Name</Label>
                    <Input
                      id="parentName"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange("parentName", e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                    <Input
                      id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                    value={formData.parentEmail}
                    onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                    <Select
                    value={formData.relationship}
                    onValueChange={(value) => handleInputChange("relationship", value)}
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
              </div>
            </TabsContent>

            {/* Fee Information */}
            <TabsContent value="fees" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="totalFees">Total Fees (₹)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="totalFees"
                      type="number"
                      value={formData.totalFees}
                      onChange={(e) => handleInputChange("totalFees", e.target.value)}
                      className="glass border-white/20 pl-10"
                    />
                  </div>
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="paidAmount">Paid Amount (₹)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                      id="paidAmount"
                      type="number"
                      value={formData.paidAmount}
                      onChange={(e) => handleInputChange("paidAmount", e.target.value)}
                      className="glass border-white/20 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="remainingAmount">Remaining Amount (₹)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="remainingAmount"
                      type="number"
                      value={formData.remainingAmount}
                      className="glass border-white/20 pl-10"
                      readOnly
                    />
                  </div>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="feeStatus">Fee Status</Label>
                    <Select
                      value={formData.feeStatus}
                      onValueChange={(value) => handleInputChange("feeStatus", value)}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue placeholder="Select fee status" />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border-white/20">
                        <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="nextPaymentDue">Next Payment Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal glass border-white/20 ${
                          !formData.nextPaymentDue ? "text-muted-foreground" : ""
                        }`}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.nextPaymentDue
                          ? format(new Date(formData.nextPaymentDue), "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.nextPaymentDue ? new Date(formData.nextPaymentDue) : undefined}
                        onSelect={(date) => {
                          handleInputChange(
                            "nextPaymentDue",
                            date ? date.toISOString().split("T")[0] : ""
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal; 