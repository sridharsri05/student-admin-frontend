
import { useState } from "react";
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

interface Batch {
  id: string;
  name: string;
  course: string;
  instructor: string;
  instructorImage: string;
  maxCapacity: number;
  currentEnrollment: number;
  startDate: string;
  endDate: string;
  schedule: string;
  mode: "offline" | "online" | "hybrid";
  venue: string;
  fees: number;
  status: "active" | "upcoming" | "completed" | "cancelled";
}

interface BatchListProps {
  searchTerm: string;
}

export const BatchList = ({ searchTerm }: BatchListProps) => {
  // Mock data - in real app, this would come from an API
  const [batches] = useState<Batch[]>([
    {
      id: "BATCH001",
      name: "JEE Main 2024 Morning Batch",
      course: "JEE Main Preparation",
      instructor: "Dr. Rajesh Sharma",
      instructorImage: "",
      maxCapacity: 30,
      currentEnrollment: 28,
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      schedule: "Mon, Wed, Fri - 9:00 AM to 12:00 PM",
      mode: "offline",
      venue: "Room 101, Main Building",
      fees: 25000,
      status: "active"
    },
    {
      id: "BATCH002",
      name: "NEET Evening Batch",
      course: "NEET Preparation",
      instructor: "Prof. Priya Gupta",
      instructorImage: "",
      maxCapacity: 25,
      currentEnrollment: 22,
      startDate: "2024-02-01",
      endDate: "2024-07-01",
      schedule: "Tue, Thu, Sat - 4:00 PM to 7:00 PM",
      mode: "hybrid",
      venue: "Room 205, Science Block",
      fees: 30000,
      status: "active"
    },
    {
      id: "BATCH003",
      name: "Foundation Mathematics",
      course: "Foundation Course",
      instructor: "Mr. Arjun Patel",
      instructorImage: "",
      maxCapacity: 35,
      currentEnrollment: 15,
      startDate: "2024-03-01",
      endDate: "2024-08-01",
      schedule: "Mon to Fri - 2:00 PM to 4:00 PM",
      mode: "online",
      venue: "Online Platform",
      fees: 15000,
      status: "upcoming"
    }
  ]);

  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Card key={batch.id} className="glass border-white/10 hover-lift hover-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{batch.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{batch.id}</p>
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
                      <DropdownMenuItem className="hover:bg-white/10">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Batch
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10 text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Batch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{batch.course}</span>
                  </div>
                  
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
                    <span className="text-sm text-muted-foreground">{batch.schedule}</span>
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
                  <Button variant="outline" size="sm" className="flex-1 border-white/20 hover:bg-white/10">
                    View Students
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-white/20 hover:bg-white/10">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
