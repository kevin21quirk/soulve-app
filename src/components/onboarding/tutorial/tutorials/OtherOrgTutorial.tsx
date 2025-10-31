import { InteractiveDemoCard } from '../InteractiveDemoCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Handshake, TrendingUp, Plus } from 'lucide-react';

export const otherOrgTutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to SouLVE',
    description: 'Connect with your community and amplify your social impact.',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="w-4 h-4 text-primary" />
          <span className="font-medium">Amplify Your Civic Engagement</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage community consultations, volunteer programs, and local initiatives.
        </p>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Organization Dashboard',
    description: 'Manage your community programs and track engagement.',
    content: (
      <InteractiveDemoCard>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Community Members</div>
            <div className="text-lg font-bold">234</div>
          </div>
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Active Programs</div>
            <div className="text-lg font-bold">7</div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'programs',
    title: 'Community Programs',
    description: 'Create and manage community initiatives and volunteer opportunities.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Youth Mentorship Program</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>12 volunteers • 24 participants</span>
          </div>
          <Button size="sm" className="w-full gap-1 mt-2">
            <Plus className="w-3 h-3" />
            Create Program
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'partnerships',
    title: 'Local Partnerships',
    description: 'Connect with charities, businesses, and community groups in your area.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Handshake className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Partnership Network</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Collaborate with local organizations for greater impact
          </p>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'engagement',
    title: 'Community Engagement',
    description: 'Gather feedback and coordinate community initiatives.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-medium">Community Input</div>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs">Surveys</Badge>
            <Badge variant="secondary" className="text-xs">Forums</Badge>
            <Badge variant="secondary" className="text-xs">Events</Badge>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'volunteers',
    title: 'Volunteer Coordination',
    description: 'Mobilize community volunteers for public projects and events.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Park Beautification Day</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>20 volunteers signed up</span>
          </div>
          <Button size="sm" variant="outline" className="w-full gap-1">
            <Plus className="w-3 h-3" />
            Post Volunteer Opportunity
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'analytics',
    title: 'Impact Reporting',
    description: 'Track community engagement, volunteer participation, and program outcomes.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Impact Dashboard</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Volunteer Hours</div>
              <div className="text-lg font-bold">856</div>
            </div>
            <div>
              <div className="text-muted-foreground">Programs Run</div>
              <div className="text-lg font-bold">12</div>
            </div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'complete',
    title: 'Ready to Engage!',
    description: 'Start building stronger community connections!',
    content: (
      <div className="text-center space-y-3 py-2">
        <div className="text-4xl">🎯</div>
        <Button className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Launch First Initiative
        </Button>
      </div>
    ),
  },
];
