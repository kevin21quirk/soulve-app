import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  impact_value: number | null;
  beneficiaries_count: number;
  location: string | null;
  published_at: string;
}

interface OrganizationActivityFeedProps {
  activities: Activity[];
}

const OrganizationActivityFeed = ({ activities }: OrganizationActivityFeedProps) => {
  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      campaign: 'bg-[hsl(var(--soulve-blue))]',
      donation: 'bg-[hsl(var(--soulve-green))]',
      volunteer: 'bg-[hsl(var(--soulve-purple))]',
      event: 'bg-[hsl(var(--soulve-orange))]',
      milestone: 'bg-[hsl(var(--soulve-pink))]',
    };
    return colors[type] || 'bg-muted';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No activities yet. Check back soon!
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className={`w-1 rounded-full ${getActivityColor(activity.activity_type)}`} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-foreground">{activity.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {activity.activity_type}
                    </Badge>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(activity.published_at), 'MMM dd, yyyy')}
                    </div>
                    {activity.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </div>
                    )}
                    {activity.beneficiaries_count > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {activity.beneficiaries_count} people impacted
                      </div>
                    )}
                    {activity.impact_value && (
                      <div className="font-semibold text-[hsl(var(--soulve-green))]">
                        £{activity.impact_value.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizationActivityFeed;
