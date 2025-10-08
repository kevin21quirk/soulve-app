import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OrganizationFollowButtonProps {
  organizationId: string;
  followerCount: number;
  onFollowChange?: () => void;
}

const OrganizationFollowButton = ({
  organizationId,
  followerCount,
  onFollowChange,
}: OrganizationFollowButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFollowStatus();
    }
  }, [user, organizationId]);

  const checkFollowStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('organization_followers')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('follower_id', user.id)
      .single();

    setIsFollowing(!!data);
  };

  const handleFollowToggle = async () => {
    if (!user) {
      toast({ title: 'Please sign in to follow organizations', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from('organization_followers')
        .delete()
        .eq('organization_id', organizationId)
        .eq('follower_id', user.id);

      if (error) {
        toast({ title: 'Failed to unfollow', variant: 'destructive' });
      } else {
        setIsFollowing(false);
        toast({ title: 'Unfollowed successfully' });
        onFollowChange?.();
      }
    } else {
      const { error } = await supabase.from('organization_followers').insert({
        organization_id: organizationId,
        follower_id: user.id,
      });

      if (error) {
        toast({ title: 'Failed to follow', variant: 'destructive' });
      } else {
        setIsFollowing(true);
        toast({ title: 'Following successfully!' });
        onFollowChange?.();
      }
    }

    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isLoading}
      variant={isFollowing ? 'secondary' : 'default'}
      className="gap-2"
    >
      <Heart className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
      {isFollowing ? 'Following' : 'Follow'}
      <span className="text-xs opacity-70">({followerCount})</span>
    </Button>
  );
};

export default OrganizationFollowButton;
