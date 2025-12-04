import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, List } from 'lucide-react';
import { useFeedSuggestions } from '@/hooks/usePersonalizedFeed';

interface ForYouFeedToggleProps {
  isPersonalized: boolean;
  onToggle: (personalized: boolean) => void;
}

const ForYouFeedToggle = ({ isPersonalized, onToggle }: ForYouFeedToggleProps) => {
  const { data: suggestions } = useFeedSuggestions();

  if (!suggestions?.hasPreferences) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant={isPersonalized ? "default" : "outline"}
        size="sm"
        onClick={() => onToggle(true)}
        className="gap-1"
      >
        <Sparkles className="h-4 w-4" />
        For You
        {isPersonalized && suggestions.interests.length > 0 && (
          <Badge variant="secondary" className="ml-1 text-xs">
            {suggestions.interests.length + suggestions.skills.length}
          </Badge>
        )}
      </Button>
      <Button
        variant={!isPersonalized ? "default" : "outline"}
        size="sm"
        onClick={() => onToggle(false)}
        className="gap-1"
      >
        <List className="h-4 w-4" />
        All Posts
      </Button>
      
      {isPersonalized && (
        <span className="text-xs text-muted-foreground ml-2">
          Showing posts matching your interests
        </span>
      )}
    </div>
  );
};

export default ForYouFeedToggle;
