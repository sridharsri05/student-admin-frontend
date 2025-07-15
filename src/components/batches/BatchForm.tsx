
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Users, Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBatches } from "@/hooks/useBatches";
import { useLookups } from "@/hooks/useLookups";

export const BatchForm = ({ onSuccess }) => {
  const { toast } = useToast();
  const { createBatch } = useBatches();
  const { lookups } = useLookups();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    batchName: "",
    course: "",
    coursePackage: "",
    instructor: "",
    maxCapacity: "",
    startDate: "",
    endDate: "",
    duration: "",
    mode: "",
    venue: "",
    fees: "",
    description: "",
    prerequisites: "",
    schedule: {
      monday: { enabled: false, startTime: "", endTime: "" },
      tuesday: { enabled: false, startTime: "", endTime: "" },
      wednesday: { enabled: false, startTime: "", endTime: "" },
      thursday: { enabled: false, startTime: "", endTime: "" },
      friday: { enabled: false, startTime: "", endTime: "" },
      saturday: { enabled: false, startTime: "", endTime: "" },
      sunday: { enabled: false, startTime: "", endTime: "" }
    }
  });

  const handleInputChange = (field: string, value: string) => {
    // If coursePackage is changed, auto-fill fees if available
    if (field === "coursePackage") {
      const selectedPkg = lookups.coursePackages?.find(pkg => pkg._id === value);
      setFormData(prev => ({
        ...prev,
        coursePackage: value,
        fees: selectedPkg && selectedPkg.fee ? selectedPkg.fee.toString() : ""
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare payload
      const payload = {
        name: formData.batchName,
        course: formData.course,
        coursePackage: formData.coursePackage,
        instructor: formData.instructor,
        maxCapacity: parseInt(formData.maxCapacity) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration,
        mode: formData.mode,
        venue: formData.venue,
        fees: parseFloat(formData.fees) || 0,
        description: formData.description,
        prerequisites: formData.prerequisites,
        schedule: formData.schedule
      };
      await createBatch(payload);
      toast({
        title: "Batch Created Successfully!",
        description: "The new batch has been created and is ready for student enrollment.",
      });
      setFormData({
        batchName: "", course: "", instructor: "", maxCapacity: "",
        coursePackage: "",
        startDate: "", endDate: "", duration: "", mode: "", venue: "",
        fees: "", description: "", prerequisites: "",
        schedule: {
          monday: { enabled: false, startTime: "", endTime: "" },
          tuesday: { enabled: false, startTime: "", endTime: "" },
          wednesday: { enabled: false, startTime: "", endTime: "" },
          thursday: { enabled: false, startTime: "", endTime: "" },
          friday: { enabled: false, startTime: "", endTime: "" },
          saturday: { enabled: false, startTime: "", endTime: "" },
          sunday: { enabled: false, startTime: "", endTime: "" }
        }
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Failed to Create Batch",
        description: error?.message || "There was an error creating the batch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-purple">
            <BookOpen className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="batchName">Batch Name *</Label>
            <Input
              id="batchName"
              value={formData.batchName}
              onChange={(e) => handleInputChange("batchName", e.target.value)}
              className="glass border-white/20"
              placeholder="e.g., JEE Main 2024 Morning Batch"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent className="glass bg-background border-white/20">
                {lookups.courses?.map(course => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coursePackage">Course Package *</Label>
            <Select value={formData.coursePackage} onValueChange={(value) => handleInputChange("coursePackage", value)}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select course package" />
              </SelectTrigger>
              <SelectContent className="glass bg-background border-white/20">
                {lookups.coursePackages?.map(pkg => (
                  <SelectItem key={pkg._id} value={pkg._id}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor *</Label>
            <Select value={formData.instructor} onValueChange={(value) => handleInputChange("instructor", value)}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent className="glass bg-background border-white/20">
                <SelectItem value="dr-sharma">Dr. Rajesh Sharma</SelectItem>
                <SelectItem value="prof-gupta">Prof. Priya Gupta</SelectItem>
                <SelectItem value="mr-patel">Mr. Arjun Patel</SelectItem>
                <SelectItem value="ms-singh">Ms. Kavita Singh</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Maximum Capacity *</Label>
            <Input
              id="maxCapacity"
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => handleInputChange("maxCapacity", e.target.value)}
              className="glass border-white/20"
              placeholder="e.g., 30"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className="glass border-white/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className="glass border-white/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mode">Mode *</Label>
            <Select value={formData.mode} onValueChange={(value) => handleInputChange("mode", value)}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="glass bg-background border-white/20">
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fees">Fees (₹) *</Label>
            <Input
              id="fees"
              type="number"
              value={formData.fees}
              onChange={(e) => handleInputChange("fees", e.target.value)}
              className="glass border-white/20"
              placeholder="e.g., 25000"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-cyan">
            <Calendar className="w-5 h-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {days.map((day) => (
            <div key={day} className="flex items-center space-x-4 p-4 glass rounded-lg border border-white/10">
              <div className="flex items-center space-x-2 w-24">
                <Checkbox
                  checked={formData.schedule[day as keyof typeof formData.schedule].enabled}
                  onCheckedChange={(checked) => handleScheduleChange(day, "enabled", checked)}
                />
                <Label className="capitalize font-medium">{day}</Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  type="time"
                  value={formData.schedule[day as keyof typeof formData.schedule].startTime}
                  onChange={(e) => handleScheduleChange(day, "startTime", e.target.value)}
                  className="glass border-white/20"
                  disabled={!formData.schedule[day as keyof typeof formData.schedule].enabled}
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={formData.schedule[day as keyof typeof formData.schedule].endTime}
                  onChange={(e) => handleScheduleChange(day, "endTime", e.target.value)}
                  className="glass border-white/20"
                  disabled={!formData.schedule[day as keyof typeof formData.schedule].enabled}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-green">
            <MapPin className="w-5 h-5" />
            Additional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              className="glass border-white/20"
              placeholder="e.g., Room 101, Main Building"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="glass border-white/20"
              rows={3}
              placeholder="Brief description of the batch and course content..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prerequisites">Prerequisites</Label>
            <Textarea
              id="prerequisites"
              value={formData.prerequisites}
              onChange={(e) => handleInputChange("prerequisites", e.target.value)}
              className="glass border-white/20"
              rows={3}
              placeholder="Prerequisites or requirements for this batch..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/80 hover:to-neon-pink/80 px-8 py-3"
        >
          {loading ? "Creating Batch..." : "Create Batch"}
        </Button>
      </div>
    </form>
  );
};
