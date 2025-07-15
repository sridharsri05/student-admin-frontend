import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, DollarSign, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useLookups } from "@/hooks/useLookups";

interface Batch {
  _id: string;
  name: string;
  instructor: string;
  maxCapacity: number;
  startDate: string;
  endDate: string;
  mode: string;
  venue: string;
  fees: number;
}

interface EditBatchModalProps {
  batch: Batch | null;
  onSave: (updated: any) => Promise<void>;
  onClose: () => void;
}

const EditBatchModal = ({ batch, onSave, onClose }: EditBatchModalProps) => {
  const { lookups } = useLookups();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => ({
    name: batch?.name || "",
    course: (batch as any)?.course?._id || "",
    coursePackage: (batch as any)?.coursePackage?._id || "",
    instructor: batch?.instructor || "",
    maxCapacity: batch?.maxCapacity?.toString() || "",
    startDate: batch?.startDate?.split("T")[0] || "",
    endDate: batch?.endDate?.split("T")[0] || "",
    mode: batch?.mode || "",
    venue: batch?.venue || "",
    fees: batch?.fees?.toString() || ((batch as any)?.coursePackage?.fee?.toString() || ""),
    description: (batch as any)?.description || "",
    prerequisites: (batch as any)?.prerequisites || "",
    schedule: (batch as any)?.schedule || {
      monday: { enabled: false, startTime: "", endTime: "" },
      tuesday: { enabled: false, startTime: "", endTime: "" },
      wednesday: { enabled: false, startTime: "", endTime: "" },
      thursday: { enabled: false, startTime: "", endTime: "" },
      friday: { enabled: false, startTime: "", endTime: "" },
      saturday: { enabled: false, startTime: "", endTime: "" },
      sunday: { enabled: false, startTime: "", endTime: "" },
    },
  }));

  if (!batch) return null;

  const handleChange = (field: string, value: string) => {
    if (field === "coursePackage") {
      const selPkg = lookups.coursePackages?.find((pkg) => pkg._id === value);
      setFormData((prev) => ({
        ...prev,
        coursePackage: value,
        fees: selPkg && selPkg.fee ? selPkg.fee.toString() : prev.fees,
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (day: string, field: string, value: string | boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        course: formData.course,
        coursePackage: formData.coursePackage,
        instructor: formData.instructor,
        maxCapacity: parseInt(formData.maxCapacity) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        mode: formData.mode,
        venue: formData.venue,
        fees: parseFloat(formData.fees) || 0,
        description: formData.description,
        prerequisites: formData.prerequisites,
        schedule: formData.schedule,
      };
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!batch} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gradient">Edit Batch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[75vh] pr-2">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Batch Name</Label>
              <Input value={formData.name} onChange={e => handleChange("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={formData.course} onValueChange={v => handleChange("course", v)}>
                <SelectTrigger className="glass border-white/20"><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent className="glass bg-background border-white/20">
                  {lookups.courses?.map(c => <SelectItem value={c._id} key={c._id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Course Package</Label>
              <Select value={formData.coursePackage} onValueChange={v => handleChange("coursePackage", v)}>
                <SelectTrigger className="glass border-white/20"><SelectValue placeholder="Select package" /></SelectTrigger>
                <SelectContent className="glass bg-background border-white/20">
                  {lookups.coursePackages?.map(p => <SelectItem value={p._id} key={p._id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Instructor</Label>
              <Input value={formData.instructor} onChange={e => handleChange("instructor", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Max Capacity</Label>
              <Input type="number" value={formData.maxCapacity} onChange={e => handleChange("maxCapacity", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Mode</Label>
              <Select value={formData.mode} onValueChange={v => handleChange("mode", v)}>
                <SelectTrigger className="glass border-white/20"><SelectValue placeholder="Select mode" /></SelectTrigger>
                <SelectContent className="glass bg-background border-white/20">
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fees (₹)</Label>
              <Input type="number" value={formData.fees} onChange={e => handleChange("fees", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Venue</Label>
              <Input value={formData.venue} onChange={e => handleChange("venue", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={formData.startDate} onChange={e => handleChange("startDate", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={formData.endDate} onChange={e => handleChange("endDate", e.target.value)} required />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <Label className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> Schedule</Label>
            {Object.keys(formData.schedule).map(day => (
              <div key={day} className="flex items-center space-x-3">
                <Checkbox
                  checked={formData.schedule[day].enabled}
                  onCheckedChange={(v) => handleScheduleChange(day, "enabled", v)}
                />
                <span className="capitalize w-20 text-sm">{day}</span>
                <Input type="time" value={formData.schedule[day].startTime} disabled={!formData.schedule[day].enabled} className="glass border-white/20"
                  onChange={e => handleScheduleChange(day, "startTime", e.target.value)}
                />
                <span className="text-muted-foreground">to</span>
                <Input type="time" value={formData.schedule[day].endTime} disabled={!formData.schedule[day].enabled} className="glass border-white/20"
                  onChange={e => handleScheduleChange(day, "endTime", e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Additional */}
          <div className="space-y-4">
            <Label>Description</Label>
            <Textarea rows={3} value={formData.description} onChange={e => handleChange("description", e.target.value)} className="glass border-white/20" />
            <Label>Prerequisites</Label>
            <Textarea rows={3} value={formData.prerequisites} onChange={e => handleChange("prerequisites", e.target.value)} className="glass border-white/20" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/80 hover:to-neon-pink/80">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBatchModal; 