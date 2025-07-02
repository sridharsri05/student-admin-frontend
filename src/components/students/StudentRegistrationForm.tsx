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
import { apiCall } from "../../config/api";

export const StudentRegistrationForm = ({ onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [coursePackages, setCoursePackages] = useState<any[]>([]);
  const [batchPreferences, setBatchPreferences] = useState<any[]>([]);
  const [courseModes, setCourseModes] = useState<any[]>([]);
  const [nation, setNation] = useState<any[]>([]);
  const [nextRollNumber, setNextRollNumber] = useState<{ rollNumber?: string }>({});

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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

    // Emergency Contact
    // emergencyName: "",
    // emergencyPhone: "",
    // emergencyRelation: "",

    // Additional Information
    // medicalConditions: "",
    // specialRequirements: "",
    // howDidYouHear: "",

    // Photo Upload
    photo: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // batch: formData.batchPreference,        // You can update if separate
      batchPreference: formData.batchPreference,
      courseMode: formData.courseMode,
      nationality: formData.nationality,
    };

    try {
      await apiCall("/students/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast({
        title: "Student Registered Successfully!",
        description:
          "The student has been added to the system and will receive a confirmation email.",
      });

      // Reset form after success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        status: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        relationship: "",
        university: "",
        course: "",
        semester: "",
        rollNumber: "",
        // previousEducation: "",
        selectedCourse: "",
        batchPreference: "",
        courseMode: "",
        nationality: "",
        // emergencyName: "",
        // emergencyPhone: "",
        // emergencyRelation: "",
        // medicalConditions: "",
        // specialRequirements: "",
        // howDidYouHear: "",
        photo: null,
      });
      onSuccess?.(); // Call onSuccess callback to refresh data or navigate
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
    const fetchData = async () => {
      try {
        const [uniRes, courseRes, modeRes, batchRes, packageRes, nationRes, rollNum] =
          await Promise.all([
            apiCall("/universities"),
            apiCall("/courses"),
            apiCall("/course-modes"),
            apiCall("/batch-preferences"),
            apiCall("/course-packages"),
            apiCall("/nationalities"),
            apiCall("/next-roll-number"),
          ]);
        setUniversities(uniRes);
        setCourses(courseRes);
        setCourseModes(modeRes);
        setBatchPreferences(batchRes);
        setCoursePackages(packageRes);
        setNation(nationRes);
        setNextRollNumber(rollNum);
      } catch (err) {
        console.error("Failed to fetch master data:", err);
      }
    };
    if (!universities.length) {
      fetchData();
    }
  }, []);

  console.log(universities, "datafghdgdj");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
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
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="glass border-white/20"
              required
            />
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
                <SelectItem value="active-paid">Active Paid</SelectItem>
                <SelectItem value="active-pending">Active Pending</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
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
                <SelectContent className="glass bg-background border-white/20">
                  {nation &&
                    nation?.map((nat) => (
                      <SelectItem key={nat._id} value={nat._id}>
                        {nat?.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parent/Guardian Information */}
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
              value={formData.parentPhone}
              onChange={(e) => handleInputChange("parentPhone", e.target.value)}
              className="glass border-white/20"
              required
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

      {/* Academic Information */}
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
                {universities &&
                  universities?.map((uni) => (
                    <SelectItem key={uni._id} value={uni._id}>
                      {uni?.name}
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
                {courses?.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Course Selection */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-pink">
            <CreditCard className="w-5 h-5" />
            Course Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="selectedCourse">Select Course Package *</Label>
            <Select
              value={formData.selectedCourse}
              onValueChange={(value) => handleInputChange("selectedCourse", value)}
            >
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select course package" />
              </SelectTrigger>
              <SelectContent className="glass bg-background border-white/20">
                {coursePackages?.map((pkg) => (
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
                <SelectValue placeholder="Select batch preference" />
              </SelectTrigger>
              <SelectContent className="glass bg-background border-white/20">
                {batchPreferences?.map((batch) => (
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
                {courseModes?.map((mode) => (
                  <SelectItem key={mode._id} value={mode._id}>
                    {mode?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      {/* <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Phone className="w-5 h-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyName}
              onChange={(e) => handleInputChange("emergencyName", e.target.value)}
              className="glass border-white/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
              className="glass border-white/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyRelation">Relationship *</Label>
            <Input
              id="emergencyRelation"
              value={formData.emergencyRelation}
              onChange={(e) => handleInputChange("emergencyRelation", e.target.value)}
              className="glass border-white/20"
              required
            />
          </div>
        </CardContent>
      </Card> */}

      {/* Additional Information */}
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
    </form>
  );
};
