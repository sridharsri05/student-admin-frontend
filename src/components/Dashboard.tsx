
// import { Users, BookOpen, DollarSign, TrendingUp, Calendar, Award } from "lucide-react";
// import { MetricCard } from "./MetricCard";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";

// export const Dashboard = () => {
//   const metrics = [
//     {
//       title: "Total Students",
//       value: "1,234",
//       change: "+12% from last month",
//       changeType: "positive" as const,
//       icon: Users,
//       iconColor: "from-neon-cyan to-neon-blue",
//       trend: [20, 40, 30, 60, 45, 70, 80, 65, 90, 75]
//     },
//     {
//       title: "Active Batches",
//       value: "24",
//       change: "+3 new this month",
//       changeType: "positive" as const,
//       icon: BookOpen,
//       iconColor: "from-neon-purple to-neon-pink",
//       trend: [30, 50, 40, 70, 60, 80, 65, 85, 70, 90]
//     },
//     {
//       title: "Monthly Revenue",
//       value: "$52,340",
//       change: "+8.5% from last month",
//       changeType: "positive" as const,
//       icon: DollarSign,
//       iconColor: "from-neon-green to-emerald-500",
//       trend: [40, 60, 50, 80, 70, 90, 85, 95, 80, 100]
//     },
//     {
//       title: "Average Performance",
//       value: "87.3%",
//       change: "+2.1% improvement",
//       changeType: "positive" as const,
//       icon: TrendingUp,
//       iconColor: "from-orange-400 to-red-400",
//       trend: [50, 65, 60, 75, 70, 85, 80, 90, 85, 95]
//     }
//   ];

//   const upcomingClasses = [
//     { subject: "Mathematics", batch: "Grade 10-A", time: "09:00 AM", students: 28 },
//     { subject: "Physics", batch: "Grade 12-B", time: "11:00 AM", students: 24 },
//     { subject: "Chemistry", batch: "Grade 11-A", time: "02:00 PM", students: 32 },
//     { subject: "English", batch: "Grade 9-C", time: "04:00 PM", students: 26 }
//   ];

//   const recentActivities = [
//     { action: "New student enrolled", details: "John Doe joined Grade 10-A", time: "2 hours ago" },
//     { action: "Fee payment received", details: "$250 from Sarah Wilson", time: "4 hours ago" },
//     { action: "Test scores updated", details: "Mathematics test results for Grade 11-B", time: "6 hours ago" },
//     { action: "New batch created", details: "Advanced Physics for Grade 12", time: "1 day ago" }
//   ];

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Welcome Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gradient">Welcome back, Admin!</h1>
//           <p className="text-muted-foreground mt-1">Here's what's happening at your tuition center today.</p>
//         </div>
//         <div className="flex space-x-3">
//           <Button className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80">
//             <Users className="w-4 h-4 mr-2" />
//             Add Student
//           </Button>
//           <Button variant="outline" className="border-white/20 hover:bg-white/10">
//             <Calendar className="w-4 h-4 mr-2" />
//             Schedule Class
//           </Button>
//         </div>
//       </div>

//       {/* Metrics Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {metrics.map((metric, index) => (
//           <div key={metric.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
//             <MetricCard {...metric} />
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {/* Today's Classes */}
//         <Card className="glass border-white/10 hover-lift">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Calendar className="w-5 h-5 mr-2 text-neon-cyan" />
//               Today's Classes
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {upcomingClasses.map((cls, index) => (
//               <div key={index} className="flex items-center justify-between p-3 glass rounded-lg border border-white/10">
//                 <div>
//                   <h4 className="font-medium text-foreground">{cls.subject}</h4>
//                   <p className="text-sm text-muted-foreground">{cls.batch}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-neon-cyan">{cls.time}</p>
//                   <p className="text-xs text-muted-foreground">{cls.students} students</p>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Performance Overview */}
//         <Card className="glass border-white/10 hover-lift">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Award className="w-5 h-5 mr-2 text-neon-purple" />
//               Performance Overview
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-3">
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-muted-foreground">Grade 12</span>
//                   <span className="text-sm font-medium text-foreground">92%</span>
//                 </div>
//                 <Progress value={92} className="h-2" />
//               </div>
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-muted-foreground">Grade 11</span>
//                   <span className="text-sm font-medium text-foreground">87%</span>
//                 </div>
//                 <Progress value={87} className="h-2" />
//               </div>
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-muted-foreground">Grade 10</span>
//                   <span className="text-sm font-medium text-foreground">84%</span>
//                 </div>
//                 <Progress value={84} className="h-2" />
//               </div>
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-muted-foreground">Grade 9</span>
//                   <span className="text-sm font-medium text-foreground">89%</span>
//                 </div>
//                 <Progress value={89} className="h-2" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent Activities */}
//         <Card className="glass border-white/10 hover-lift">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <TrendingUp className="w-5 h-5 mr-2 text-neon-green" />
//               Recent Activities
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {recentActivities.map((activity, index) => (
//               <div key={index} className="flex items-start space-x-3 p-3 glass rounded-lg border border-white/10">
//                 <div className="w-2 h-2 bg-neon-cyan rounded-full mt-2 flex-shrink-0"></div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
//                   <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
//                   <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Calendar,
  BookOpen,
  CreditCard,
  AlertCircle,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleAddStudent = () => {
    navigate("/students", { state: { activeTab: "register" } });
  };

  // Mock data - replace with real API calls
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-neon-cyan",
    },
    {
      title: "Active Batches",
      value: "15",
      change: "+2",
      changeType: "positive",
      icon: GraduationCap,
      color: "text-neon-green",
    },
    {
      title: "Monthly Revenue",
      value: "₹2,45,000",
      change: "+18%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-neon-purple",
    },
    {
      title: "Pending Payments",
      value: "₹45,000",
      change: "-5%",
      changeType: "negative",
      icon: AlertCircle,
      color: "text-neon-pink",
    },
  ];

  const recentActivities = [
    {
      type: "student",
      message: "New student John Doe enrolled in React Batch",
      time: "2 hours ago",
    },
    {
      type: "payment",
      message: "Payment of ₹15,000 received from Jane Smith",
      time: "4 hours ago",
    },
    {
      type: "batch",
      message: "Node.js Advanced batch started with 25 students",
      time: "1 day ago",
    },
    {
      type: "student",
      message: "Mike Johnson completed Full Stack course",
      time: "2 days ago",
    },
  ];

  const upcomingBatches = [
    { name: "React Advanced", startDate: "2024-02-15", students: 28, capacity: 30 },
    { name: "Python for AI", startDate: "2024-02-20", students: 22, capacity: 25 },
    { name: "DevOps Bootcamp", startDate: "2024-02-25", students: 18, capacity: 20 },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening at your academy.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/10"
            onClick={() => navigate("/reports")}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button
            className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
            onClick={handleAddStudent}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass border-white/10 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp
                      className={`w-4 h-4 mr-1 ${
                        stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="glass border-white/10 lg:col-span-1 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-gradient">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg glass border border-white/10"
                >
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "student" && (
                      <Users className="w-4 h-4 text-neon-cyan" />
                    )}
                    {activity.type === "payment" && (
                      <CreditCard className="w-4 h-4 text-neon-green" />
                    )}
                    {activity.type === "batch" && (
                      <BookOpen className="w-4 h-4 text-neon-purple" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-gradient">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 hover:from-neon-cyan/30 hover:to-neon-purple/30 border border-neon-cyan/50"
              onClick={handleAddStudent}
            >
              <Plus className="w-4 h-4 mr-2 text-neon-cyan" />
              Add New Student
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start glass border-white/20 hover:bg-white/10"
              onClick={() => navigate("/batches")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Create New Batch
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start glass border-white/20 hover:bg-white/10"
              onClick={() => navigate("/payment-reports")}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start glass border-white/20 hover:bg-white/10"
              onClick={() => navigate("/reports")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Batches */}
      <Card className="glass border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gradient">Upcoming Batches</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/batches")}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingBatches.map((batch, index) => (
              <div key={index} className="p-4 rounded-lg glass border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{batch.name}</h3>
                  <Badge
                    variant="outline"
                    className="border-neon-green/50 text-neon-green"
                  >
                    Starting Soon
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {batch.startDate}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enrollment</span>
                    <span>
                      {batch.students}/{batch.capacity}
                    </span>
                  </div>
                  <Progress
                    value={(batch.students / batch.capacity) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};