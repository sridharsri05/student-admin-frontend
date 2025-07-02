import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export const PaymentStats = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass border-white/10">
            <CardContent className="p-3 sm:p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-6 bg-white/20 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${(analytics.totalRevenue || 0).toLocaleString()}`,
      icon: CreditCard,
      color: "text-neon-green",
      bgColor: "bg-neon-green/20",
      badge: "+15%",
    },
    {
      title: "Pending Payments",
      value: `₹${(analytics.pendingPayments || 0).toLocaleString()}`,
      icon: AlertCircle,
      color: "text-neon-pink",
      bgColor: "bg-neon-pink/20",
      badge: "Pending",
    },
    {
      title: "Successful",
      value: analytics.successfulPayments || 0,
      icon: CheckCircle,
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/20",
      badge: "Success",
    },
    {
      title: "Failed",
      value: analytics.failedPayments || 0,
      icon: AlertCircle,
      color: "text-red-400",
      bgColor: "bg-red-400/20",
      badge: "Failed",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="glass border-white/10 hover-lift">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {stat.title}
                </p>
                <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <Badge className={`${stat.bgColor} ${stat.color} text-xs flex-shrink-0`}>
                  {stat.badge}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
