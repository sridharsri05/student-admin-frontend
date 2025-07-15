import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884D8'];

export const EnhancedPaymentAnalytics = ({ data = {} }) => {
  const monthlyRevenueData = useMemo(() => {
    // Assuming data.monthlyRevenue is an array of { month, amount }
    return data.monthlyRevenue?.map(item => ({
      month: item.month,
      amount: Number(item.amount || 0)
    })) || [];
  }, [data.monthlyRevenue]);

  const paymentMethodBreakdown = useMemo(() => {
    // Assuming data.paymentMethods is an object with method names as keys
    return Object.entries(data.paymentMethods || {}).map(([name, value]) => ({
      name, 
      value: Number(value || 0)
    }));
  }, [data.paymentMethods]);

  const revenueGrowth = useMemo(() => {
    if (!data.monthlyRevenue || data.monthlyRevenue.length < 2) return 0;
    
    const lastMonth = data.monthlyRevenue[data.monthlyRevenue.length - 1].amount;
    const previousMonth = data.monthlyRevenue[data.monthlyRevenue.length - 2].amount;
    
    return ((lastMonth - previousMonth) / previousMonth * 100).toFixed(2);
  }, [data.monthlyRevenue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Revenue Trend */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-gradient text-lg flex items-center justify-between">
            Monthly Revenue Trend
            <div className="flex items-center">
              {revenueGrowth >= 0 ? (
                <TrendingUp className="w-5 h-5 text-neon-green mr-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
              )}
              <span className={`text-sm ${revenueGrowth >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                {revenueGrowth}%
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px' 
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#8884D8" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment Method Breakdown */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-gradient text-lg">
            Payment Method Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentMethodBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {paymentMethodBreakdown.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px' 
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ 
                  paddingTop: '10px',
                  color: 'rgba(255,255,255,0.7)' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
