import { useUserType, getUserTypeLabel, getDashboardConfig, UserType } from '@/hooks/useUserType';
import { useAuth } from '@/contexts/AuthContext';
import { usePostCreation } from '@/contexts/PostCreationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Heart, HelpCircle, Users, Plus, Target, BarChart, 
  Building2, FileText, Calendar, MessageSquare, Handshake, HandHeart 
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="h-4 w-4" />,
  HandHeart: <HandHeart className="h-4 w-4" />,
  HelpCircle: <HelpCircle className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Plus: <Plus className="h-4 w-4" />,
  Target: <Target className="h-4 w-4" />,
  BarChart: <BarChart className="h-4 w-4" />,
  Building2: <Building2 className="h-4 w-4" />,
  Heart: <Heart className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  Handshake: <Handshake className="h-4 w-4" />,
};

interface PersonalizedWelcomeProps {
  onNavigateToTab: (tab: string) => void;
}

const PersonalizedWelcome = ({ onNavigateToTab }: PersonalizedWelcomeProps) => {
  const { user } = useAuth();
  const { data: userTypeData, isLoading } = useUserType();
  const { openPostComposer } = usePostCreation();

  if (isLoading || !userTypeData) {
    return null;
  }

  const { userType, interests } = userTypeData;
  const config = getDashboardConfig(userType);
  const firstName = user?.user_metadata?.first_name || 'there';

  const handleQuickAction = (action: string) => {
    // Map actions to tabs or trigger post composer with appropriate options
    switch (action) {
      case 'discover':
      case 'feed':
      case 'connect':
      case 'campaigns':
      case 'analytics':
      case 'charity-tools':
      case 'business-tools':
      case 'csr':
      case 'esg':
      case 'group-tools':
        onNavigateToTab(action);
        break;
      case 'create-post':
        // Open post composer with "help-offered" category for offering help
        openPostComposer({ category: 'help-offered' });
        break;
      case 'create-help':
        // Open post composer with "help-needed" category and high urgency
        openPostComposer({ category: 'help-needed', urgency: 'high' });
        break;
      case 'create-opportunity':
        // Open post composer with "volunteer" category for posting opportunities
        openPostComposer({ category: 'volunteer' });
        break;
      case 'create-event':
        // Open post composer with event creator dialog open
        openPostComposer({ openWithEvent: true });
        break;
      default:
        onNavigateToTab('feed');
    }
  };

  return (
    <Card className="mb-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                Welcome back, {firstName}! 👋
              </h2>
              <Badge variant="secondary" className="text-xs">
                {getUserTypeLabel(userType)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {config.welcomeMessage}
            </p>
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs bg-background">
                    {interest}
                  </Badge>
                ))}
                {interests.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-background">
                    +{interests.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {config.quickActions.slice(0, 3).map((action) => (
              <Button
                key={action.action}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="gap-1 text-xs"
              >
                {iconMap[action.icon]}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedWelcome;
