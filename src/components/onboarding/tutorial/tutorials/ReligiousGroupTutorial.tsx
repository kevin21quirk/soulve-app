import { InteractiveDemoCard } from '../InteractiveDemoCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, HandHelping, Plus } from 'lucide-react';

export const religiousGroupTutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome Faith Leaders',
    description: 'Connect with your congregation and extend your community service mission.',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-primary" />
          <span className="font-medium">Extend Your Ministry</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Coordinate faith-based outreach, service projects, and community support.
        </p>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Ministry Dashboard',
    description: 'Coordinate faith-based outreach, service projects, and community support.',
    content: (
      <InteractiveDemoCard>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Congregation</div>
            <div className="text-lg font-bold">156</div>
          </div>
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Service Hours</div>
            <div className="text-lg font-bold">428</div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'service-opportunities',
    title: 'Service Opportunities',
    description: 'Post faith-based volunteer opportunities and community service projects.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Food Pantry Service</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HandHelping className="w-3 h-3" />
            <span>Every Saturday • 8 volunteers needed</span>
          </div>
          <Button size="sm" className="w-full gap-1 mt-2">
            <Plus className="w-3 h-3" />
            Post Service Opportunity
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'congregation',
    title: 'Congregation Engagement',
    description: 'Keep members informed about events, volunteer needs, and community initiatives.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Member Updates</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Share announcements, prayer requests, and service opportunities
          </p>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'outreach',
    title: 'Outreach Programs',
    description: 'Manage food banks, support groups, and community assistance programs.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-medium">Active Programs</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="text-xs">Food Bank</Badge>
              <span className="text-muted-foreground">Tuesdays & Fridays</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="text-xs">Youth Group</Badge>
              <span className="text-muted-foreground">Wednesdays</span>
            </div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'interfaith',
    title: 'Interfaith Connections',
    description: 'Connect with other faith groups for collaborative community service.',
    content: (
      <div className="space-y-2">
        <div className="p-2 bg-background rounded-lg">
          <div className="text-xs font-medium">Partnership Opportunities</div>
          <div className="text-xs text-muted-foreground mt-1">
            8 faith communities nearby for collaborative service
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'events',
    title: 'Event Management',
    description: 'Organize worship services, community gatherings, and special events.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Community Thanksgiving</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Thursday, Nov 23 • 6:00 PM</span>
          </div>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs">68 attending</Badge>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'analytics',
    title: 'Impact Measurement',
    description: 'Track your faith community\'s service impact and outreach.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-medium">This Quarter</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Meals Served</div>
              <div className="text-lg font-bold">1,247</div>
            </div>
            <div>
              <div className="text-muted-foreground">Families Helped</div>
              <div className="text-lg font-bold">89</div>
            </div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'complete',
    title: 'Begin Your Mission!',
    description: 'Start organizing your community service initiatives!',
    content: (
      <div className="text-center space-y-3 py-2">
        <div className="text-4xl">🙏</div>
        <Button className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Create Service Opportunity
        </Button>
      </div>
    ),
  },
];
