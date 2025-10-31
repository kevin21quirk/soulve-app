import { InteractiveDemoCard } from '../InteractiveDemoCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MapPin, Megaphone, Plus } from 'lucide-react';

export const communityGroupTutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome Community Leaders',
    description: 'SouLVE helps you organize events, coordinate volunteers, and expand your reach.',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-medium">Strengthen Your Community</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Organize events, engage members, and coordinate community projects.
        </p>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Group Dashboard',
    description: 'Manage members, events, and community projects from your central hub.',
    content: (
      <InteractiveDemoCard>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Active Members</div>
            <div className="text-lg font-bold">87</div>
          </div>
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Upcoming Events</div>
            <div className="text-lg font-bold">5</div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'events',
    title: 'Event Organization',
    description: 'Create and promote community events with built-in RSVP management.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Community Cleanup Day</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Saturday, Dec 10 • 9:00 AM</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>Central Park</span>
          </div>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">32 attending</Badge>
          </div>
          <Button size="sm" className="w-full gap-1 mt-2">
            <Plus className="w-3 h-3" />
            Create Event
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'members',
    title: 'Member Coordination',
    description: 'Keep members engaged with updates, discussions, and volunteer opportunities.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Member Communication</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Send updates, create polls, and coordinate activities
          </p>
          <Button size="sm" variant="outline" className="w-full gap-1">
            <Megaphone className="w-3 h-3" />
            Send Update
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'volunteers',
    title: 'Volunteer Recruitment',
    description: 'Find volunteers for your projects from the wider SouLVE community.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-medium">Need Volunteers</div>
          <div className="text-xs text-muted-foreground">
            Post opportunities visible to the entire community
          </div>
          <Button size="sm" className="w-full gap-1">
            <Plus className="w-3 h-3" />
            Post Volunteer Opportunity
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'resources',
    title: 'Resource Sharing',
    description: 'Connect with other groups to share resources, venues, and expertise.',
    content: (
      <div className="space-y-2">
        <div className="p-2 bg-background rounded-lg">
          <div className="text-xs font-medium">Resource Network</div>
          <div className="text-xs text-muted-foreground mt-1">
            15 community groups nearby available for collaboration
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'calendar',
    title: 'Community Calendar',
    description: 'Your events appear on local community calendars automatically.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Shared Calendar</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your events are visible to everyone in your area
          </p>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'analytics',
    title: 'Impact Tracking',
    description: 'Track attendance, volunteer hours, and community engagement.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-medium">This Month</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Events Held</div>
              <div className="text-lg font-bold">8</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Attendance</div>
              <div className="text-lg font-bold">247</div>
            </div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'complete',
    title: "Let's Get Started!",
    description: 'Ready to bring your community together!',
    content: (
      <div className="text-center space-y-3 py-2">
        <div className="text-4xl">🌟</div>
        <Button className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Create Your First Event
        </Button>
      </div>
    ),
  },
];
