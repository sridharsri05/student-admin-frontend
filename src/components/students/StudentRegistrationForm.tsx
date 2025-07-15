import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLookups } from "@/hooks/useLookups";
import { apiCall } from "../../config/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Format phone number to XXX-XXX-XXXX
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/\D/g, '');
  if (phoneNumber.length < 4) return phoneNumber;
  if (phoneNumber.length < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export const StudentRegistrationForm = ({ onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { lookups } = useLookups();
  const navigate = useNavigate();
  const [nextRollNumber, setNextRollNumber] = useState<{ rollNumber?: string }>({});
  const [formErrors, setFormErrors] = useState<{ phone?: string; parentPhone?: string }>({});

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneFormatted: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    status: "",
    nationality: "",
    // Parent/Guardian Information
    parentName: "",
    parentPhone: "",
    parentPhoneFormatted: "",
    parentEmail: "",
    relationship: "",

    // Academic Information
    university: "",
    course: "",
    semester: "",
    rollNumber: "",
    // previousEducation: "",

    // Course Selection
    selectedCourse: "",
    batchPreference: "",
    courseMode: "",

    // Additional Information
    medicalConditions: "",
    howDidYouHear: "",

    // Photo Upload
    photo: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    // Phone validation: only allow digits and max 10 digits
    if (field === "phone" || field === "parentPhone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length > 10) value = digits.slice(0, 10);
      else value = digits;
      
      // Store raw digits but display formatted
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        [`${field}Formatted`]: formatPhoneNumber(value)
      }));
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      return;
    }
    
    // Auto-fill totalFees when selectedCourse changes
    if (field === "selectedCourse") {
      setFormData(prev => ({
        ...prev,
        selectedCourse: value,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    let valid = true;
    const errors: { phone?: string; parentPhone?: string } = {};
    if (formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits.";
      valid = false;
    }
    if (formData.parentPhone.length !== 10) {
      errors.parentPhone = "Parent/Guardian phone must be exactly 10 digits.";
      valid = false;
    }
    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    // Prepare payload matching backend schema
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dateOfBirth, // ✅ matches schema
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
      coursePackage: formData.selectedCourse,
      semester: formData.semester,
      batchPreference: formData.batchPreference,
      courseMode: formData.courseMode,
      nationality: formData.nationality,
      totalFees: 0, // Adding this to satisfy the validation requirement
    };

    try {
      const response = await apiCall("/students/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Student registration response:", response); // Debug to see the response structure

      toast({
        title: "Student Registered Successfully!",
        description:
          "The student has been added to the system. You can now add fee details.",
        duration: 5000,
      });

      // Reset form after success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        phoneFormatted: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        status: "",
        parentName: "",
        parentPhone: "",
        parentPhoneFormatted: "",
        parentEmail: "",
        relationship: "",
        university: "",
        course: "",
        semester: "",
        rollNumber: "",
        selectedCourse: "",
        batchPreference: "",
        courseMode: "",
        nationality: "",
        medicalConditions: "",
        howDidYouHear: "",
        photo: null,
      });
      
      onSuccess?.(response.student || response); // Pass the student data to parent component for fee handling
      
      // Handle navigation - Check for student ID in correct response structure
      const studentId = response.student?._id || response.student?.id || response._id || response.id;
      
      if (studentId) {
        // Navigate directly to fees page with the student ID and a flag indicating this is a new registration
        navigate(`/fees?studentId=${studentId}&isNewRegistration=true`);
      } else {
        console.error("Could not find student ID in response:", response);
        navigate("/students"); // Navigate to students list if we can't find the ID
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error?.response?.data?.error ||
          "There was an error registering the student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRollNumber = async () => {
      try {
        const rollNum = await apiCall("/next-roll-number");
        setNextRollNumber(rollNum);
      } catch (err) {
        console.error("Failed to fetch roll number:", err);
      }
    };
    fetchRollNumber();
  }, []);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Personal Information */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-cyan">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="glass border-white/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                value={formData.phoneFormatted || formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="glass border-white/20"
                required
                inputMode="numeric"
                placeholder="XXX-XXX-XXXX"
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="glass border-white/20"
                required
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
              />
              <p className="text-xs text-muted-foreground">
                Select your date of birth using the date picker
              </p>
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
            <div className="space-y-2 md:col-span-2">
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nation">Nationalities *</Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) => handleInputChange("nationality", value)}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent className="glass bg-background border-white/20">
                  {lookups.nationalities &&
                    lookups.nationalities?.map((nat) => (
                      <SelectItem key={nat._id} value={nat._id}>
                        {nat?.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Academic Information */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-green">
              <GraduationCap className="w-5 h-5" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">University/College *</Label>
              <Select
                value={formData.university}
                onValueChange={(value) => handleInputChange("university", value)}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent className="glass bg-background border-white/20">
                  {lookups.universities &&
                    lookups.universities?.map((uni) => (
                      <SelectItem key={uni._id} value={uni._id}>
                        {uni?.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Academic Stream *</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => handleInputChange("course", value)}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select academic stream" />
                </SelectTrigger>
                <SelectContent className="glass bg-background border-white/20">
                  {lookups.courses?.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Main field of study (Medical, Engineering, etc.)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester/Year *</Label>
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
                value={nextRollNumber?.rollNumber}
                className="glass border-white/20"
                readOnly
                placeholder="Auto-generated roll number"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Parent/Guardian Information */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-purple">
              <Phone className="w-5 h-5" />
              Parent/Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name *</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => handleInputChange("parentName", e.target.value)}
                className="glass border-white/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent/Guardian Phone *</Label>
              <Input
                id="parentPhone"
                value={formData.parentPhoneFormatted || formData.parentPhone}
                onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                className="glass border-white/20"
                required
                inputMode="numeric"
                placeholder="XXX-XXX-XXXX"
              />
              {formErrors.parentPhone && (
                <p className="text-xs text-red-500 mt-1">{formErrors.parentPhone}</p>
              )}
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
              <Label htmlFor="relationship">Relationship *</Label>
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
          </CardContent>
        </Card>
      </motion.div>
      {/* Course Selection & Additional Information */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.35 }}>
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-pink">
              <CreditCard className="w-5 h-5" />
              Program Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selectedCourse">Preparation Program *</Label>
              <Select
                value={formData.selectedCourse}
                onValueChange={(value) => handleInputChange("selectedCourse", value)}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select preparation program" />
                </SelectTrigger>
                <SelectContent className="glass bg-background border-white/20">
                  {lookups.coursePackages?.map((pkg) => (
                    <SelectItem key={pkg._id} value={pkg._id}>
                      {pkg?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Specific coaching program (JEE, NEET, Foundation, etc.)</p>
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
                  {lookups.batches?.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch?.name}
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
                  {lookups.courseModes?.map((mode) => (
                    <SelectItem key={mode._id} value={mode._id}>
                      {mode?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 }}>
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Mail className="w-5 h-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Medical Conditions (if any)</Label>
              <Textarea
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                className="glass border-white/20"
                rows={3}
                placeholder="Please mention any medical conditions, allergies, or special requirements..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
              <Select
                value={formData.howDidYouHear}
                onValueChange={(value) => handleInputChange("howDidYouHear", value)}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="glass bg-background border-white/20">
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="friend-referral">Friend Referral</SelectItem>
                  <SelectItem value="google-search">Google Search</SelectItem>
                  <SelectItem value="newspaper">Newspaper</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80 px-8 py-3"
        >
          {loading ? "Registering..." : "Register Student"}
        </Button>
      </div>
    </motion.form>
  );
};
