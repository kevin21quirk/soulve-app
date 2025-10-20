import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Award, Search, UserCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface BadgeOption {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  badge_category: string;
  event_identifier?: string;
}

interface UserOption {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

interface CanAwardResult {
  can_award: boolean;
  reason?: string;
  retry_after?: string;
}

const QuickBadgeAwardTool = () => {
  const { toast } = useToast();
  const [badges, setBadges] = useState<BadgeOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<BadgeOption | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [contributionDetails, setContributionDetails] = useState('');
  const [awarding, setAwarding] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [badgePopoverOpen, setBadgePopoverOpen] = useState(false);

  useEffect(() => {
    loadBadges();
  }, []);

  useEffect(() => {
    if (userSearch.length >= 2) {
      searchUsers(userSearch);
    } else {
      setUsers([]);
    }
  }, [userSearch]);

  const loadBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('id, name, icon, rarity, badge_category, event_identifier')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setBadges((data || []) as BadgeOption[]);
    } catch (error) {
      console.error('Error loading badges:', error);
      toast({
        title: 'Error',
        description: 'Failed to load badges',
        variant: 'destructive',
      });
    }
  };

  const searchUsers = async (search: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
        .limit(10);

      if (error) throw error;
      setUsers((data || []) as UserOption[]);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAwardBadge = async () => {
    if (!selectedUser || !selectedBadge) {
      toast({
        title: 'Missing Information',
        description: 'Please select both a user and a badge',
        variant: 'destructive',
      });
      return;
    }

    if (!contributionDetails.trim()) {
      toast({
        title: 'Missing Details',
        description: 'Please provide contribution details explaining why this badge is being awarded',
        variant: 'destructive',
      });
      return;
    }

    setAwarding(true);
    try {
      // Check if badge can be awarded
      const { data: checkData, error: checkError } = await supabase
        .rpc('can_award_badge', {
          p_badge_id: selectedBadge.id,
          p_user_id: selectedUser.id
        });

      if (checkError) throw checkError;

      const result = checkData as unknown as CanAwardResult;
      
      if (!result || !result.can_award) {
        toast({
          title: 'Cannot Award Badge',
          description: result?.reason || 'Badge cannot be awarded to this user',
          variant: 'destructive',
        });
        return;
      }

      // Create verified badge award
      const { error: insertError } = await supabase
        .from('badge_award_log')
        .insert({
          user_id: selectedUser.id,
          badge_id: selectedBadge.id,
          awarded_at: new Date().toISOString(),
          verification_status: 'verified',
          contribution_details: {
            admin_awarded: true,
            details: contributionDetails,
            awarded_by: 'admin'
          },
          metadata: {
            manual_award: true,
            award_reason: contributionDetails
          }
        });

      if (insertError) throw insertError;

      toast({
        title: 'Badge Awarded! 🎉',
        description: `${selectedBadge.icon} ${selectedBadge.name} has been awarded to ${selectedUser.first_name} ${selectedUser.last_name}`,
      });

      // Reset form
      setSelectedUser(null);
      setSelectedBadge(null);
      setContributionDetails('');
      setUserSearch('');
    } catch (error) {
      console.error('Error awarding badge:', error);
      toast({
        title: 'Error',
        description: 'Failed to award badge. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAwarding(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Quick Badge Award Tool</CardTitle>
            <CardDescription>
              Manually award badges to users for verified contributions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Search */}
        <div className="space-y-2">
          <Label>Select User</Label>
          <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedUser ? (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    {selectedUser.first_name} {selectedUser.last_name}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    Search for user by name or email...
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search users..." 
                  value={userSearch}
                  onValueChange={setUserSearch}
                />
                <CommandList>
                  <CommandEmpty>
                    {userSearch.length < 2 
                      ? 'Type at least 2 characters to search'
                      : 'No users found'
                    }
                  </CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => {
                          setSelectedUser(user);
                          setUserPopoverOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.first_name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {user.first_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Badge Selection */}
        <div className="space-y-2">
          <Label>Select Badge</Label>
          <Popover open={badgePopoverOpen} onOpenChange={setBadgePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedBadge ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedBadge.icon}</span>
                    <span>{selectedBadge.name}</span>
                    <Badge className={getRarityColor(selectedBadge.rarity)} variant="secondary">
                      {selectedBadge.rarity}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4" />
                    Select a badge to award...
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search badges..." />
                <CommandList>
                  <CommandEmpty>No badges found</CommandEmpty>
                  <CommandGroup>
                    {badges.map((badge) => (
                      <CommandItem
                        key={badge.id}
                        value={badge.id}
                        onSelect={() => {
                          setSelectedBadge(badge);
                          setBadgePopoverOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-2xl">{badge.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium">{badge.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRarityColor(badge.rarity)} variant="secondary">
                                {badge.rarity}
                              </Badge>
                              {badge.event_identifier && (
                                <Badge variant="outline" className="text-xs">
                                  {badge.event_identifier}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Contribution Details */}
        <div className="space-y-2">
          <Label>Contribution Details *</Label>
          <Textarea
            value={contributionDetails}
            onChange={(e) => setContributionDetails(e.target.value)}
            placeholder="Explain why this badge is being awarded (e.g., 'Volunteered 40 hours at Grenfell Tower relief center June 2017', 'Led disaster response coordination team')"
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This information will be visible to the user and stored in the badge award log
          </p>
        </div>

        {/* Award Button */}
        <Button
          onClick={handleAwardBadge}
          disabled={!selectedUser || !selectedBadge || !contributionDetails.trim() || awarding}
          className="w-full"
          size="lg"
        >
          <Award className="h-4 w-4 mr-2" />
          {awarding ? 'Awarding Badge...' : 'Award Badge'}
        </Button>

        {/* Selected Summary */}
        {(selectedUser || selectedBadge) && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <p className="text-sm font-medium">Award Summary:</p>
            {selectedUser && (
              <p className="text-sm">
                <span className="text-muted-foreground">User:</span> {selectedUser.first_name} {selectedUser.last_name}
              </p>
            )}
            {selectedBadge && (
              <p className="text-sm">
                <span className="text-muted-foreground">Badge:</span> {selectedBadge.icon} {selectedBadge.name}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickBadgeAwardTool;
