import { useState } from "react";
import { useBatches } from "@/hooks/useBatches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Search, Filter, Calendar, Users, Clock, MapPin } from "lucide-react";
import { BatchForm } from "@/components/batches/BatchForm";
import { BatchList } from "@/components/batches/BatchList";
import { BatchSchedule } from "@/components/batches/BatchSchedule";
import BatchFilterBar from '@/components/batches/BatchFilterBar';
import BatchListTable from '@/components/batches/BatchListTable';

export const Batches = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm,setSearchTerm]=useState("");
  const [statusFilter,setStatusFilter]=useState("");
  const [modeFilter,setModeFilter]=useState("");
  const [courseFilter,setCourseFilter]=useState("");
  const { batches, loading, error, analytics, lastFetch, fetchBatches } = useBatches();

  const filtered = batches.filter(b=>{
    if(statusFilter && b.status!==statusFilter) return false;
    if(modeFilter && b.mode!==modeFilter) return false;
    if(courseFilter){
      const cid= typeof b.course==='object'? b.course._id: b.course;
      if(cid!==courseFilter) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-neon-purple" />
            Batch Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage course batches, schedules, and capacity</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-white/20 hover:bg-white/10"
            onClick={() => setActiveTab("schedule")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Schedule
          </Button>
          <Button 
            className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/80 hover:to-neon-pink/80"
            onClick={() => setActiveTab("create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold text-neon-purple">{analytics.totalBatches || 0}</p>
              </div>
              <Badge className="bg-neon-purple/20 text-neon-purple">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students Enrolled</p>
                <p className="text-2xl font-bold text-neon-cyan">{analytics.totalStudents || 0}</p>
              </div>
              <Badge className="bg-neon-cyan/20 text-neon-cyan">+12%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Capacity</p>
                <p className="text-2xl font-bold text-neon-green">{analytics.averageCapacity ? Math.round(analytics.averageCapacity)+'%' : '--'}</p>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green">Optimal</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Classes Today</p>
                <p className="text-2xl font-bold text-neon-pink">{analytics.classesToday || 0}</p>
              </div>
              <Badge className="bg-neon-pink/20 text-neon-pink">Scheduled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <TabsList className="glass border-white/20">
            <TabsTrigger value="list" className="data-[state=active]:bg-primary/20">Card View</TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-primary/20">Table View</TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-primary/20">Create Batch</TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary/20">Schedule View</TabsTrigger>
          </TabsList>
          {/* Batch count & last-updated info with improved colors */}
          <div className="text-right whitespace-nowrap text-sm md:ml-auto md:pr-2">
            <div className="text-neon-cyan">
              Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{batches.length}</span> batches
            </div>
            {lastFetch && (
              <div className="text-xs text-neon-purple">
                Last updated: <span className="font-medium">{new Date(lastFetch).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          <BatchFilterBar search={searchTerm} onSearchChange={setSearchTerm}
            status={statusFilter} onStatusChange={setStatusFilter}
            mode={modeFilter} onModeChange={setModeFilter}
            course={courseFilter} onCourseChange={setCourseFilter}
            onRefresh={fetchBatches}
          />
          <BatchList searchTerm={searchTerm} batches={filtered} loading={loading} error={error} />
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <BatchFilterBar search={searchTerm} onSearchChange={setSearchTerm}
            status={statusFilter} onStatusChange={setStatusFilter}
            mode={modeFilter} onModeChange={setModeFilter}
            course={courseFilter} onCourseChange={setCourseFilter}
            onRefresh={fetchBatches}
          />
          <BatchListTable batches={filtered} />
        </TabsContent>

        <TabsContent value="create">
          <BatchForm onSuccess={() => { fetchBatches(); setActiveTab("list"); }} />
        </TabsContent>

        <TabsContent value="schedule">
          <BatchSchedule />
        </TabsContent>
      </Tabs>
    </div>
  );
};
