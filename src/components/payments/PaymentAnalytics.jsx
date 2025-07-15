import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Users 
} from 'lucide-react';

export const PaymentAnalytics = ({ data = {} }) => {
  const dailyRevenueData = useMemo(() => {
    // Assuming data.dailyRevenue is an array of { date, amount }
    return data.dailyRevenue?.map(item => ({
      date: item.date,
      amount: Number(item.amount || 0)
    })) || [];
  }, [data.dailyRevenue]);

  const totalRevenue = useMemo(() => {
    return dailyRevenueData.reduce((sum, item) => sum + item.amount, 0);
  }, [dailyRevenueData]);

  const averagePaymentSize = useMemo(() => {
    return data.totalPayments > 0 
      ? (totalRevenue / data.totalPayments).toFixed(2) 
      : 0;
  }, [totalRevenue, data.totalPayments]);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass border-white/10 hover:border-white/20 transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold text-gradient">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-neon-green opacity-70" />
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover:border-white/20 transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-xl font-bold text-gradient">
                {data.totalPayments || 0}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-neon-cyan opacity-70" />
          </CardContent>
        </Card>
        <Card className="glass border-white/10 hover:border-white/20 transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Payment</p>
              <p className="text-xl font-bold text-gradient">
                ₹{averagePaymentSize}
              </p>
            </div>
            <Users className="w-8 h-8 text-neon-purple opacity-70" />
          </CardContent>
        </Card>
      </div>

      {/* Daily Revenue Trend */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-gradient text-lg">
            Daily Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884D8" 
                fill="url(#colorUv)" 
                fillOpacity={0.3}
              />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884D8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884D8" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
