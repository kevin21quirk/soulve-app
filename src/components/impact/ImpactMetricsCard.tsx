
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ImpactMetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
}

const ImpactMetricsCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description,
  trend
}: ImpactMetricsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          {trend && (
            <div className={`text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? '+' : '-'}{trend.value}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactMetricsCard;
