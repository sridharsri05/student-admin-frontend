
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
  trend?: number[];
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  iconColor,
  trend 
}: MetricCardProps) => {
  const changeColors = {
    positive: 'text-neon-green',
    negative: 'text-red-400',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className="glass hover-lift hover-glow border-white/10 bg-gradient-to-br from-white/5 to-white/0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        
        {change && (
          <p className={`text-xs ${changeColors[changeType]} flex items-center`}>
            {change}
          </p>
        )}
        
        {trend && (
          <div className="mt-4">
            <div className="flex items-end space-x-1 h-6">
              {trend.map((height, index) => (
                <div
                  key={index}
                  className="bg-primary/30 rounded-sm flex-1"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
