import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  duration: number;
  createdAt?: string;
}

interface PollDisplayProps {
  postId: string;
  pollData: PollData;
  onVote?: () => void;
}

export const PollDisplay = ({ postId, pollData, onVote }: PollDisplayProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [localPollData, setLocalPollData] = useState(pollData);

  const totalVotes = localPollData.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleOptionClick = (optionId: string) => {
    if (hasVoted) return;

    if (localPollData.allowMultiple) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (!user || selectedOptions.length === 0) return;

    setIsVoting(true);
    try {
      // Store vote in post_interactions
      const { error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          interaction_type: 'poll_vote',
          content: JSON.stringify({ selectedOptions })
        });

      if (error) throw error;

      // Update local state optimistically
      setLocalPollData(prev => ({
        ...prev,
        options: prev.options.map(opt => ({
          ...opt,
          votes: selectedOptions.includes(opt.id) ? opt.votes + 1 : opt.votes
        }))
      }));

      setHasVoted(true);
      onVote?.();

      toast({
        title: "Vote recorded",
        description: "Your vote has been submitted successfully."
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  // Calculate remaining time
  const getRemainingTime = () => {
    if (!localPollData.createdAt) return 'Active';
    const endTime = new Date(localPollData.createdAt).getTime() + (localPollData.duration * 60 * 60 * 1000);
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Less than 1h remaining';
  };

  return (
    <div className="bg-accent/30 rounded-xl p-4 border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">Poll</span>
        <span className="text-xs text-muted-foreground ml-auto">{getRemainingTime()}</span>
      </div>

      <h4 className="font-medium text-foreground mb-4">{localPollData.question}</h4>

      <div className="space-y-2">
        {localPollData.options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOptions.includes(option.id);

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={hasVoted}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                hasVoted
                  ? 'cursor-default'
                  : 'cursor-pointer hover:border-primary/50'
              } ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 bg-background'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                  <span className="text-sm font-medium">{option.text}</span>
                </div>
                {hasVoted && (
                  <span className="text-sm font-semibold text-primary">{percentage}%</span>
                )}
              </div>
              {hasVoted && (
                <Progress value={percentage} className="h-1.5 mt-2" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          {localPollData.allowMultiple && ' • Multiple choice'}
        </span>
        {!hasVoted && selectedOptions.length > 0 && (
          <Button
            size="sm"
            onClick={handleVote}
            disabled={isVoting}
          >
            {isVoting ? 'Voting...' : 'Vote'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PollDisplay;
