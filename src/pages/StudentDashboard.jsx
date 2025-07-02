import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  BookOpen,
  CreditCard,
  Clock,
  Award,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState({
    profile: {
      name: user?.user_metadata?.name || "Student",
      email: user?.email || "",
      phone: "+91 9876543210",
      batch: "JEE Main Morning Batch",
      course: "JEE Main Preparation",
      joinDate: "2024-01-15",
      studentId: "STU001",
    },
    attendance: {
      totalClasses: 45,
      attended: 42,
      percentage: 93.3,
    },
    payments: {
      totalFees: 25000,
      paidAmount: 25000,
      pendingAmount: 0,
      nextDueDate: "2024-02-15",
    },
    performance: {
      averageScore: 87.5,
      totalTests: 12,
      rank: 5,
      improvement: "+5.2%",
    },
    upcomingClasses: [
      {
        subject: "Mathematics",
        time: "09:00 AM",
        date: "Today",
        topic: "Calculus - Derivatives",
      },
      {
        subject: "Physics",
        time: "11:00 AM",
        date: "Today",
        topic: "Mechanics - Motion in 2D",
      },
      {
        subject: "Chemistry",
        time: "02:00 PM",
        date: "Tomorrow",
        topic: "Organic Chemistry - Hydrocarbons",
      },
    ],
    recentTests: [
      { subject: "Mathematics", score: 92, maxScore: 100, date: "2024-01-10" },
      { subject: "Physics", score: 85, maxScore: 100, date: "2024-01-08" },
      { subject: "Chemistry", score: 88, maxScore: 100, date: "2024-01-05" },
    ],
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            Welcome back, {studentData.profile.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your academic progress and upcoming activities.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-neon-green/20 text-neon-green">
            {studentData.profile.course}
          </Badge>
          <Badge variant="outline">ID: {studentData.profile.studentId}</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold text-neon-green">
                  {studentData.attendance.percentage}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {studentData.attendance.attended}/{studentData.attendance.totalClasses}{" "}
                  classes
                </p>
              </div>
              <Calendar className="w-8 h-8 text-neon-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold text-neon-purple">
                  {studentData.performance.averageScore}%
                </p>
                <p className="text-xs text-neon-green">
                  {studentData.performance.improvement} improvement
                </p>
              </div>
              <Award className="w-8 h-8 text-neon-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Class Rank</p>
                <p className="text-2xl font-bold text-neon-cyan">
                  #{studentData.performance.rank}
                </p>
                <p className="text-xs text-muted-foreground">Out of 30 students</p>
              </div>
              <BookOpen className="w-8 h-8 text-neon-cyan" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fees Status</p>
                <p className="text-2xl font-bold text-neon-green">Paid</p>
                <p className="text-xs text-muted-foreground">
                  ₹{studentData.payments.paidAmount.toLocaleString()}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-neon-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="glass border-white/10 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-neon-cyan" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{studentData.profile.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{studentData.profile.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{studentData.profile.batch}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Joined: {new Date(studentData.profile.joinDate).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="glass border-white/10 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-neon-purple" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.upcomingClasses.map((cls, index) => (
              <div key={index} className="p-3 glass rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-foreground">{cls.subject}</h4>
                  <Badge variant="outline" className="text-xs">
                    {cls.date}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{cls.topic}</p>
                <p className="text-xs text-neon-cyan">{cls.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Test Results */}
        <Card className="glass border-white/10 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-neon-green" />
              Recent Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.recentTests.map((test, index) => (
              <div key={index} className="p-3 glass rounded-lg border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-foreground">{test.subject}</h4>
                  <span className="text-sm font-bold text-neon-green">
                    {test.score}/{test.maxScore}
                  </span>
                </div>
                <Progress
                  value={(test.score / test.maxScore) * 100}
                  className="h-2 mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Date: {new Date(test.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Attendance Chart */}
      <Card className="glass border-white/10 hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-neon-cyan" />
            Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overall Attendance</span>
              <span className="text-sm font-medium">
                {studentData.attendance.percentage}%
              </span>
            </div>
            <Progress value={studentData.attendance.percentage} className="h-3" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-green">
                  {studentData.attendance.attended}
                </p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">
                  {studentData.attendance.totalClasses - studentData.attendance.attended}
                </p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-cyan">
                  {studentData.attendance.totalClasses}
                </p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
