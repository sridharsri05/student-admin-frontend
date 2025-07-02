import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 45000, payments: 120, students: 95 },
  { month: "Feb", revenue: 52000, payments: 140, students: 108 },
  { month: "Mar", revenue: 48000, payments: 135, students: 102 },
  { month: "Apr", revenue: 61000, payments: 165, students: 125 },
  { month: "May", revenue: 55000, payments: 150, students: 118 },
  { month: "Jun", revenue: 67000, payments: 180, students: 142 },
];

const paymentMethodData = [
  { name: "Credit Card", value: 45, color: "#00D4FF", gradient: "url(#cardGradient)" },
  { name: "Bank Transfer", value: 30, color: "#8B5CF6", gradient: "url(#bankGradient)" },
  { name: "UPI", value: 20, color: "#10B981", gradient: "url(#upiGradient)" },
  { name: "Cash", value: 5, color: "#EC4899", gradient: "url(#cashGradient)" },
];

const performanceData = [
  { category: "Revenue", value: 85 },
  { category: "Student Satisfaction", value: 92 },
  { category: "Payment Success Rate", value: 96 },
  { category: "Course Completion", value: 78 },
  { category: "Retention Rate", value: 88 },
  { category: "Growth Rate", value: 75 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-4 rounded-lg border border-white/20 bg-card/90 backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const GradientDefs = () => (
  <defs>
    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.8} />
      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.1} />
    </linearGradient>
    <linearGradient id="cardGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#00D4FF" />
      <stop offset="100%" stopColor="#0EA5E9" />
    </linearGradient>
    <linearGradient id="bankGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#8B5CF6" />
      <stop offset="100%" stopColor="#A855F7" />
    </linearGradient>
    <linearGradient id="upiGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#34D399" />
    </linearGradient>
    <linearGradient id="cashGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#EC4899" />
      <stop offset="100%" stopColor="#F472B6" />
    </linearGradient>
  </defs>
);

export const EnhancedPaymentAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Main Analytics Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 xl:col-span-2">
          <Card className="glass border-white/10 hover-lift h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-gradient flex items-center justify-between">
                <span>Revenue & Growth Trend</span>
                <div className="text-xs text-muted-foreground">6 Months</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <GradientDefs />
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="month"
                    stroke="#ffffff60"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00D4FF"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    dot={{ fill: "#00D4FF", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#00D4FF", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Pie Chart */}
        <Card className="glass border-white/10 hover-lift h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-gradient text-sm sm:text-base">
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <GradientDefs />
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={window.innerWidth < 640 ? 60 : 80}
                  innerRadius={window.innerWidth < 640 ? 30 : 40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#ffffff20"
                  strokeWidth={1}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.gradient} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Payment Volume Bar Chart */}
        <Card className="glass border-white/10 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-gradient text-sm sm:text-base">
              Monthly Payment Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="payments"
                  fill="url(#bankGradient)"
                  radius={[4, 4, 0, 0]}
                  stroke="#8B5CF6"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Radar Chart */}
        <Card className="glass border-white/10 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-gradient text-sm sm:text-base">
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: "#ffffff80" }}
                />
                <PolarRadiusAxis
                  angle={0}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#ffffff60" }}
                />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#00D4FF"
                  fill="#00D4FF"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ fill: "#00D4FF", strokeWidth: 2, r: 4 }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-neon-green">₹45,670</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Avg Monthly Revenue
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-neon-cyan">96.8%</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Success Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-neon-purple">₹1,847</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Avg Transaction</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover-lift">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-neon-pink">23%</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Growth Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
