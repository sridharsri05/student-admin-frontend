import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Users, 
  Calendar, 
  Clock, 
  MapPin,
  DollarSign,
  BookOpen
} from "lucide-react";
import { useBatches } from "@/hooks/useBatches";
import EditBatchModal from "./EditBatchModal";
import { useState } from "react";
import BatchStudentsModal from "./BatchStudentsModal";

interface Batch {
  _id: string;
  name: string;
  course: string;
  instructor: string;
  instructorImage: string;
  maxCapacity: number;
  currentEnrollment: number;
  startDate: string;
  endDate: string;
  schedule: any;
  mode: "offline" | "online" | "hybrid";
  venue: string;
  fees: number;
  status: "active" | "upcoming" | "completed" | "cancelled";
}

interface BatchListProps {
  searchTerm: string;
  batches: Batch[];
  loading: boolean;
  error: string | null;
}

// Helper to stringify course value
const getCourseName = (course: any) => {
  return typeof course === 'object' && course !== null ? course.name : course;
};

// Helper to stringify course package value
const getCoursePackageName = (pkg: any) => {
  return typeof pkg === 'object' && pkg !== null ? pkg.name : pkg;
};

// Helper to stringify schedule summary
const getScheduleString = (schedule: any) => {
  if (typeof schedule === 'string') return schedule;
  if (schedule && typeof schedule === 'object') {
    const enabledDays = Object.keys(schedule).filter(day => schedule[day]?.enabled);
    return enabledDays.length ? `${enabledDays.length} day(s) / week` : 'No schedule';
  }
  return '';
};

export const BatchList = ({ searchTerm, batches, loading, error }: BatchListProps) => {
  const { updateBatch, deleteBatch, fetchBatches } = useBatches();
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [manageBatchId, setManageBatchId] = useState<string | null>(null);

  const filteredBatches = batches.filter(batch => {
    const courseName = getCourseName(batch.course);
    const packageName = getCoursePackageName((batch as any).coursePackage);
    return (
      (batch.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (courseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (packageName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.instructor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch._id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-neon-cyan animate-pulse">Loading batches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-red-500">
        <span>Error loading batches: {error}</span>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-neon-green/20 text-neon-green";
      case "upcoming": return "bg-neon-cyan/20 text-neon-cyan";
      case "completed": return "bg-gray-500/20 text-gray-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "offline": return "bg-neon-purple/20 text-neon-purple";
      case "online": return "bg-neon-cyan/20 text-neon-cyan";
      case "hybrid": return "bg-neon-pink/20 text-neon-pink";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCapacityPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      try {
        await deleteBatch(id);
        await fetchBatches();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-4">
      {filteredBatches.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No batches found matching your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBatches.map((batch) => (
            <Card key={batch._id} className="glass border-white/10 hover-lift hover-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{batch.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{batch._id}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                      <Badge className={getModeColor(batch.mode)}>
                        {batch.mode}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass bg-background border-white/20">
                      <DropdownMenuItem className="hover:bg-white/10" onClick={() => setEditingBatch(batch)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Batch
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10 text-red-400" onClick={() => handleDelete(batch._id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Batch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{getCourseName(batch.course)}</span>
                  </div>
                  { (batch as any).coursePackage && (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Pkg: {getCoursePackageName((batch as any).coursePackage)}</span>
                  </div>)}
                  
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={batch.instructorImage} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-neon-cyan to-neon-purple text-white">
                        {batch.instructor.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{batch.instructor}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{getScheduleString(batch.schedule)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{batch.venue}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">₹{batch.fees.toLocaleString()}</span>
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Enrollment</span>
                    </div>
                    <span className="text-sm font-medium">
                      {batch.currentEnrollment}/{batch.maxCapacity}
                    </span>
                  </div>
                  <Progress 
                    value={getCapacityPercentage(batch.currentEnrollment, batch.maxCapacity)} 
                    className="h-2"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {getCapacityPercentage(batch.currentEnrollment, batch.maxCapacity).toFixed(0)}% filled
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {batch.maxCapacity - batch.currentEnrollment} spots available
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <Button variant="outline" size="sm" className="flex-1 border-white/20 hover:bg-white/10" onClick={()=>setManageBatchId(batch._id)}>
                    View Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {editingBatch && (
        <EditBatchModal
          batch={editingBatch}
          onSave={async (payload) => {
            try {
              await updateBatch(editingBatch._id, payload);
              await fetchBatches();
              setEditingBatch(null);
            } catch (err) {
              console.error(err);
            }
          }}
          onClose={() => setEditingBatch(null)}
        />
      )}
      {manageBatchId && (
        <BatchStudentsModal batchId={manageBatchId} open={!!manageBatchId} onClose={() => setManageBatchId(null)} />
      )}
    </div>
  );
};
