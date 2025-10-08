import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, Clock, Target, TrendingUp, Globe } from 'lucide-react';

interface ImpactMetrics {
  total_funds_raised: number;
  total_people_helped: number;
  total_volunteer_hours: number;
  active_campaigns: number;
  completed_projects: number;
  geographic_reach_countries: number;
}

interface OrganizationImpactDashboardProps {
  metrics: ImpactMetrics;
}

const OrganizationImpactDashboard = ({ metrics }: OrganizationImpactDashboardProps) => {
  const impactStats = [
    {
      icon: Heart,
      label: 'Funds Raised',
      value: `£${metrics.total_funds_raised?.toLocaleString() || 0}`,
      color: 'text-[hsl(var(--soulve-pink))]',
    },
    {
      icon: Users,
      label: 'People Helped',
      value: metrics.total_people_helped?.toLocaleString() || 0,
      color: 'text-[hsl(var(--soulve-blue))]',
    },
    {
      icon: Clock,
      label: 'Volunteer Hours',
      value: metrics.total_volunteer_hours?.toLocaleString() || 0,
      color: 'text-[hsl(var(--soulve-purple))]',
    },
    {
      icon: Target,
      label: 'Active Campaigns',
      value: metrics.active_campaigns || 0,
      color: 'text-[hsl(var(--soulve-teal))]',
    },
    {
      icon: TrendingUp,
      label: 'Completed Projects',
      value: metrics.completed_projects || 0,
      color: 'text-[hsl(var(--soulve-green))]',
    },
    {
      icon: Globe,
      label: 'Countries Reached',
      value: metrics.geographic_reach_countries || 0,
      color: 'text-[hsl(var(--soulve-orange))]',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Impact Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {impactStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Icon className={`h-8 w-8 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground text-center">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationImpactDashboard;
