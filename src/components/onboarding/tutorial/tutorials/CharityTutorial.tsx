import { InteractiveDemoCard } from '../InteractiveDemoCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Users, TrendingUp, Target, FileText, Handshake, BarChart3, CheckCircle2, Plus } from 'lucide-react';

export const charityTutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Charity Tools',
    description: "Let's show you how SouLVE helps you reach more people and manage your impact.",
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-primary" />
          <span className="font-medium">Amplify Your Impact</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Powerful tools for managing volunteers, donors, grants, and campaigns - all in one place.
        </p>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Organization Dashboard',
    description: 'This is your command center for managing volunteers, donors, and campaigns.',
    content: (
      <InteractiveDemoCard>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Active Volunteers</div>
            <div className="text-lg font-bold">24</div>
          </div>
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Total Donations</div>
            <div className="text-lg font-bold">$8.2K</div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
    targetElement: '.organization-dashboard',
  },
  {
    id: 'charity-tools',
    title: 'Charity Tools Overview',
    description: 'Access powerful tools for grant management, donor tracking, and volunteer coordination.',
    content: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-primary" />
          <span>Grant Management</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span>Donor Tracking</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Handshake className="w-4 h-4 text-primary" />
          <span>Volunteer Coordination</span>
        </div>
      </div>
    ),
    targetElement: '[data-tab="organizations"]',
  },
  {
    id: 'grant-management',
    title: 'Grant Management',
    description: 'Track grant applications, deadlines, and funding opportunities.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Community Development Grant</div>
            <Badge variant="secondary">In Progress</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Deadline: Dec 15, 2024 • $50,000
          </div>
          <Button size="sm" className="w-full gap-1 mt-2">
            <Plus className="w-3 h-3" />
            Add Grant Application
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'donor-management',
    title: 'Donor Management',
    description: 'Build relationships with donors, track donations, and manage engagement.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20" />
            <div className="flex-1">
              <div className="text-sm font-medium">John Smith</div>
              <div className="text-xs text-muted-foreground">Monthly Donor • $100/mo</div>
            </div>
          </div>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs">Recurring</Badge>
            <Badge variant="secondary" className="text-xs">6 months</Badge>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'volunteer-opportunities',
    title: 'Volunteer Opportunities',
    description: 'Post volunteer opportunities and manage applicants in one place.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Weekend Food Distribution</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>12 volunteers needed</span>
          </div>
          <Button size="sm" className="w-full gap-1">
            <Plus className="w-3 h-3" />
            Create Opportunity
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'campaigns',
    title: 'Campaign Creation',
    description: 'Launch fundraising campaigns and track progress toward your goals.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Year-End Fundraiser</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="w-3 h-3" />
            <span>$15,000 of $25,000</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-3/5 bg-gradient-to-r from-primary to-secondary" />
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'analytics',
    title: 'Impact Analytics',
    description: 'Track your organization\'s reach, volunteer hours, donations, and more.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>This Month</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Volunteer Hours</div>
              <div className="text-lg font-bold">348</div>
            </div>
            <div>
              <div className="text-muted-foreground">New Donors</div>
              <div className="text-lg font-bold">23</div>
            </div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'partnerships',
    title: 'Community Connections',
    description: 'Connect with businesses, other charities, and community groups for partnerships.',
    content: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
          <Handshake className="w-5 h-5 text-primary" />
          <div className="text-xs">
            <div className="font-medium">Partnership Opportunities</div>
            <div className="text-muted-foreground">3 organizations nearby</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'team',
    title: 'Team Management',
    description: 'Invite team members and assign roles for collaborative management.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Team Members</span>
          </div>
          <Button size="sm" variant="outline" className="w-full gap-1">
            <Plus className="w-3 h-3" />
            Invite Team Member
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'verification',
    title: 'Get Verified',
    description: 'Get verified to build trust and unlock premium features.',
    content: (
      <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-xs">
            <div className="font-medium">Verified Organizations</div>
            <div className="text-muted-foreground">Build trust with a verification badge</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'Start posting opportunities and connecting with supporters!',
    content: (
      <div className="text-center space-y-3 py-2">
        <div className="text-4xl">🎉</div>
        <Button className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Create First Opportunity
        </Button>
      </div>
    ),
  },
];
