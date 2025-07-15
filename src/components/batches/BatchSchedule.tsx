import { useState } from "react";
import { useBatchSchedule } from '@/hooks/useBatchSchedule';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";

interface ScheduleItem {
  id: string;
  batchName: string;
  course: string;
  instructor: string;
  time: string;
  duration: string;
  venue: string;
  students: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
}

export const BatchSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getWeekDates = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-neon-cyan/20 text-neon-cyan";
      case "ongoing": return "bg-neon-green/20 text-neon-green";
      case "completed": return "bg-gray-500/20 text-gray-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const weekDates = getWeekDates(currentDate);
  const { schedule, loading } = useBatchSchedule(
    weekDates[0].toISOString().split('T')[0],
    weekDates[6].toISOString().split('T')[0]
  );

  // transform schedule array to map by date
  const scheduleData: { [key: string]: ScheduleItem[] } = {};
  schedule.forEach((item: any) => {
    const dateKey = weekDates.find(d => d.toLocaleDateString('en-US',{weekday:'long'}).toLowerCase()===item.day)?.toISOString().split('T')[0] || '';
    if (!scheduleData[dateKey]) scheduleData[dateKey] = [];
    scheduleData[dateKey].push({
      id: item.id,
      batchName: item.batchName,
      course: item.course,
      instructor: item.instructor,
      time: item.time,
      duration: item.duration,
      venue: item.venue,
      students: item.students,
      status: item.status as any
    });
  });

  const today = new Date().toDateString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-neon-cyan">
              <Calendar className="w-5 h-5" />
              Weekly Schedule
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek('prev')}
                className="border-white/20 hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="px-4 py-2 glass rounded-md border border-white/10">
                <span className="font-medium">
                  {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                  {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek('next')}
                className="border-white/20 hover:bg-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 ">
        {weekDates.map((date, index) => {
          const dateStr = formatDate(date);
          const daySchedule = scheduleData[dateStr] || [];
          const isToday = date.toDateString() === today;
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <Card 
              key={index} 
              className={`glass border-white/10 ${isToday ? 'ring-2 ring-neon-cyan/50' : ''} min-w-[200px] md:min-w-0`}
            >
              <CardHeader className="pb-2">
                <div className="text-center">
                  <div className={`text-sm font-medium ${isToday ? 'text-neon-cyan' : 'text-foreground'}`}>
                    {dayName}
                  </div>
                  <div className={`text-2xl font-bold ${isToday ? 'text-neon-cyan' : 'text-muted-foreground'}`}>
                    {date.getDate()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {daySchedule.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground">No classes</p>
                  </div>
                ) : (
                  daySchedule.map((item) => (
                    <div key={item.id} className="p-3 glass rounded-lg border border-white/10 hover-lift">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(item.status)} variant="secondary">
                            {item.status}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.time}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {item.batchName}
                          </h4>
                          <p className="text-xs text-muted-foreground">{item.course}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Users className="w-3 h-3 mr-1" />
                            {item.students} students
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.venue}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10">
                          <p className="text-xs text-muted-foreground">{item.instructor}</p>
                          <p className="text-xs text-muted-foreground">{item.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card className="glass border-white/10  ">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <Badge className="bg-neon-cyan/20 text-neon-cyan">Scheduled</Badge>
              <span className="text-sm text-muted-foreground">Upcoming classes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-neon-green/20 text-neon-green">Ongoing</Badge>
              <span className="text-sm text-muted-foreground">Currently in session</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-500/20 text-gray-400">Completed</Badge>
              <span className="text-sm text-muted-foreground">Finished classes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500/20 text-red-400">Cancelled</Badge>
              <span className="text-sm text-muted-foreground">Cancelled classes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
