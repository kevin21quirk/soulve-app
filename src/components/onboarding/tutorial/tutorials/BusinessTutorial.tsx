import { InteractiveDemoCard } from '../InteractiveDemoCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, TrendingUp, Award, BarChart3, Star, Plus } from 'lucide-react';

export const businessTutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to CSR Central',
    description: 'Turn your business into a force for good. Let\'s explore SouLVE\'s CSR tools.',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-primary" />
          <span className="font-medium">Corporate Social Impact Made Easy</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Engage employees, partner with nonprofits, and measure your community impact.
        </p>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Business Dashboard',
    description: 'Manage employee volunteering, partnerships, and community impact from one place.',
    content: (
      <InteractiveDemoCard>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Employee Participation</div>
            <div className="text-lg font-bold">67%</div>
          </div>
          <div className="p-2 bg-background rounded">
            <div className="text-xs text-muted-foreground">Community Impact</div>
            <div className="text-lg font-bold">$42K</div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'employee-engagement',
    title: 'Employee Engagement',
    description: 'Connect employees with volunteer opportunities that match company values.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Employee Volunteering</span>
          </div>
          <div className="text-xs text-muted-foreground">
            45 employees volunteered 320 hours this month
          </div>
          <Button size="sm" className="w-full gap-1 mt-2">
            <Plus className="w-3 h-3" />
            Post Team Volunteer Day
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'csr-campaigns',
    title: 'CSR Campaigns',
    description: 'Launch corporate giving campaigns and track employee participation.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Holiday Giving Drive</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>$8,400 raised • 56 participants</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-gradient-to-r from-primary to-secondary" />
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'partnerships',
    title: 'Partnership Opportunities',
    description: 'Partner with local charities and community groups for meaningful impact.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20" />
            <div className="flex-1">
              <div className="text-sm font-medium">Local Youth Center</div>
              <div className="text-xs text-muted-foreground">Seeking mentors</div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full">
            Partner With Us
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'skills-volunteering',
    title: 'Skills-Based Volunteering',
    description: 'Offer your team\'s professional skills to nonprofits who need them.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-medium">Pro Bono Consulting</div>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs">Marketing</Badge>
            <Badge variant="secondary" className="text-xs">Tech</Badge>
            <Badge variant="secondary" className="text-xs">Finance</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Match employee expertise with nonprofit needs
          </p>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'analytics',
    title: 'Impact Measurement',
    description: 'Track volunteer hours, donations, and community impact for reporting.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>CSR Dashboard</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Total Hours</div>
              <div className="text-lg font-bold">1,247</div>
            </div>
            <div>
              <div className="text-muted-foreground">Nonprofits Helped</div>
              <div className="text-lg font-bold">18</div>
            </div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'storytelling',
    title: 'Brand Storytelling',
    description: 'Share your CSR initiatives and celebrate your community contributions.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Impact Stories</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Share your CSR successes and inspire others
          </p>
          <Button size="sm" variant="outline" className="w-full gap-1">
            <Plus className="w-3 h-3" />
            Share Impact Story
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'team-coordination',
    title: 'Team Coordination',
    description: 'Invite employees and managers to coordinate CSR activities.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">CSR Team</span>
          </div>
          <div className="text-xs text-muted-foreground">
            12 team leads • 145 participating employees
          </div>
          <Button size="sm" variant="outline" className="w-full gap-1">
            <Plus className="w-3 h-3" />
            Add Team Lead
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'verification',
    title: 'Verification & Trust',
    description: 'Verify your business to build credibility with community partners.',
    content: (
      <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
        <div className="flex items-start gap-2">
          <Award className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-xs">
            <div className="font-medium">Verified Business</div>
            <div className="text-muted-foreground">Build trust with verification</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'complete',
    title: 'Ready to Make Impact!',
    description: 'Start creating opportunities for your team and community!',
    content: (
      <div className="text-center space-y-3 py-2">
        <div className="text-4xl">🚀</div>
        <Button className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Launch First Initiative
        </Button>
      </div>
    ),
  },
];
