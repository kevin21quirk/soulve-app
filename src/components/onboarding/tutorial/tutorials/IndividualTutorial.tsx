import { InteractiveDemoCard } from '../InteractiveDemoCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Bell, Users, TrendingUp, Shield, Sparkles } from 'lucide-react';

export const individualTutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to SouLVE!',
    description: "Let's take 2 minutes to show you around your community network.",
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium">Discover, Connect, Make Impact</span>
        </div>
        <p className="text-sm text-muted-foreground">
          SouLVE connects you with local opportunities to volunteer, donate, and support causes you care about.
        </p>
      </div>
    ),
    targetElement: '.dashboard-container',
  },
  {
    id: 'feed',
    title: 'Your Personalized Feed',
    description: 'See help requests, volunteer opportunities, and community updates tailored to you.',
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20" />
            <div className="flex-1">
              <div className="text-sm font-medium">Local Food Bank</div>
              <div className="text-xs text-muted-foreground">2 hours ago</div>
            </div>
          </div>
          <p className="text-sm">Need volunteers this weekend to sort donations!</p>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">Volunteering</Badge>
            <Badge variant="secondary" className="text-xs">This Week</Badge>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
    targetElement: '.feed-section',
  },
  {
    id: 'campaigns',
    title: 'Finding Opportunities',
    description: "Click 'Campaigns' to discover causes you can support.",
    content: (
      <InteractiveDemoCard>
        <div className="space-y-2">
          <div className="text-sm font-semibold">Community Garden Project</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>$2,400 raised of $5,000</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-primary to-secondary" />
          </div>
          <Button size="sm" className="w-full mt-2">Support This Campaign</Button>
        </div>
      </InteractiveDemoCard>
    ),
    targetElement: '[data-tab="campaigns"]',
  },
  {
    id: 'offering-help',
    title: 'Offering Help',
    description: 'See a request you can help with? Click to respond and make a connection.',
    content: (
      <InteractiveDemoCard className="relative">
        <div className="space-y-2">
          <p className="text-sm font-medium">Someone needs help moving furniture</p>
          <p className="text-xs text-muted-foreground">2 miles away • Posted 1 hour ago</p>
          <Button size="sm" className="w-full gap-2">
            <Heart className="w-4 h-4" />
            I Can Help
          </Button>
        </div>
      </InteractiveDemoCard>
    ),
  },
  {
    id: 'safe-space',
    title: 'Safe Space Helpers',
    description: 'Need anonymous peer support? Safe Space connects you with verified listeners.',
    content: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 rounded-lg">
          <Shield className="w-5 h-5 text-primary" />
          <div className="text-xs">
            <div className="font-medium">100% Anonymous & Confidential</div>
            <div className="text-muted-foreground">Verified peer supporters available 24/7</div>
          </div>
        </div>
      </div>
    ),
    targetElement: '[data-tab="safe-space"]',
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Your profile showcases your skills and interests. Keep it updated!',
    content: (
      <InteractiveDemoCard>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
          <div className="flex-1">
            <div className="text-sm font-medium">Your Name</div>
            <div className="text-xs text-muted-foreground">5 skills • 3 interests</div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
    targetElement: '.profile-section',
  },
  {
    id: 'impact-points',
    title: 'Earning Impact Points',
    description: 'Track your impact! Earn points for helping, donating, and volunteering.',
    content: (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div className="text-sm font-medium">Impact Points</div>
          </div>
          <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            250
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Unlock badges and rewards as you help your community!
        </p>
      </div>
    ),
  },
  {
    id: 'notifications',
    title: 'Stay Updated',
    description: 'Get notified about responses, new opportunities, and community news.',
    content: (
      <InteractiveDemoCard>
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <div className="flex-1 text-sm">
            <div className="font-medium">New opportunity matches your interests</div>
            <div className="text-xs text-muted-foreground">Community Garden needs volunteers</div>
          </div>
        </div>
      </InteractiveDemoCard>
    ),
    targetElement: '.notification-bell',
  },
  {
    id: 'getting-help',
    title: 'Need Help Yourself?',
    description: 'Post a request - our community is here for you.',
    content: (
      <div className="space-y-2">
        <Button className="w-full gap-2" variant="outline">
          <Users className="w-4 h-4" />
          Request Help
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Connect with neighbors who want to help
        </p>
      </div>
    ),
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'Start exploring and making connections in your community.',
    content: (
      <div className="text-center space-y-3 py-2">
        <div className="text-4xl">🎉</div>
        <p className="text-sm text-muted-foreground">
          Your journey to making a difference starts now!
        </p>
      </div>
    ),
  },
];
