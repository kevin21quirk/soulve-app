import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Award, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement_type: string;
  requirement_value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  badge_category?: 'achievement' | 'campaign' | 'event' | 'milestone' | 'recognition';
  event_identifier?: string;
  campaign_id?: string;
  limited_edition?: boolean;
  max_awards?: number;
  current_award_count?: number;
  verification_required?: boolean;
  availability_window_start?: string;
  availability_window_end?: string;
  evidence_requirements?: any;
}

const BadgeManagementPanel = () => {
  const { toast } = useToast();
  const [badges, setBadges] = useState<BadgeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBadge, setEditingBadge] = useState<BadgeConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<BadgeConfig>>({
    name: '',
    description: '',
    icon: '',
    color: 'blue',
    requirement_type: 'points',
    requirement_value: 0,
    rarity: 'common',
    badge_category: 'achievement',
    limited_edition: false,
    verification_required: false,
  });

  useEffect(() => {
    loadBadges();
    
    // Real-time subscription
    const channel = supabase
      .channel('badges-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'badges' }, () => {
        loadBadges();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBadges((data || []) as BadgeConfig[]);
    } catch (error) {
      console.error('Error loading badges:', error);
      toast({
        title: 'Error',
        description: 'Failed to load badges',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBadge = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: 'blue',
      requirement_type: 'points',
      requirement_value: 0,
      rarity: 'common',
      badge_category: 'achievement',
      limited_edition: false,
      verification_required: false,
    });
  };

  const handleEditBadge = (badge: BadgeConfig) => {
    setEditingBadge(badge);
    setFormData(badge);
  };

  const handleSaveBadge = async () => {
    if (!formData.name || !formData.description || !formData.icon) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('badges')
          .insert({
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
            color: formData.color || 'blue',
            requirement_type: formData.requirement_type || 'points',
            requirement_value: formData.requirement_value || 0,
            rarity: formData.rarity || 'common',
            badge_category: formData.badge_category || 'achievement',
            event_identifier: formData.event_identifier || null,
            limited_edition: formData.limited_edition || false,
            max_awards: formData.max_awards || null,
            verification_required: formData.verification_required || false,
            availability_window_start: formData.availability_window_start || null,
            availability_window_end: formData.availability_window_end || null,
            evidence_requirements: formData.evidence_requirements || {}
          });

        if (error) throw error;
        toast({
          title: 'Badge Created',
          description: 'New badge has been created successfully',
        });
      } else if (editingBadge) {
        const { error } = await supabase
          .from('badges')
          .update({
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
            color: formData.color,
            requirement_type: formData.requirement_type,
            requirement_value: formData.requirement_value,
            rarity: formData.rarity,
            badge_category: formData.badge_category,
            event_identifier: formData.event_identifier || null,
            limited_edition: formData.limited_edition,
            max_awards: formData.max_awards || null,
            verification_required: formData.verification_required,
            availability_window_start: formData.availability_window_start || null,
            availability_window_end: formData.availability_window_end || null,
            evidence_requirements: formData.evidence_requirements || {}
          })
          .eq('id', editingBadge.id);

        if (error) throw error;
        toast({
          title: 'Badge Updated',
          description: 'Badge has been updated successfully',
        });
      }

      setIsCreating(false);
      setEditingBadge(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving badge:', error);
      toast({
        title: 'Error',
        description: 'Failed to save badge',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBadge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('badges')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Badge Deleted',
        description: 'Badge has been removed',
      });
    } catch (error) {
      console.error('Error deleting badge:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete badge',
        variant: 'destructive',
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading badges...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Badge Management
              </CardTitle>
              <CardDescription>
                Create and manage achievement badges
              </CardDescription>
            </div>
            <Button onClick={handleCreateBadge}>
              <Plus className="h-4 w-4 mr-2" />
              Create Badge
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <Card key={badge.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getRarityColor(badge.rarity)} variant="secondary">
                        {badge.rarity}
                      </Badge>
                      {badge.limited_edition && (
                        <Badge variant="destructive" className="text-xs">
                          Limited Edition
                        </Badge>
                      )}
                      {badge.badge_category !== 'achievement' && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {badge.badge_category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requirement: {badge.requirement_type === 'points' ? `${badge.requirement_value} points` : `${badge.requirement_value} activities`}
                    </p>
                    {badge.max_awards && (
                      <p className="text-xs text-muted-foreground">
                        Awarded: {badge.current_award_count || 0}/{badge.max_awards}
                      </p>
                    )}
                    {badge.event_identifier && (
                      <p className="text-xs font-medium text-primary">
                        Event: {badge.event_identifier}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBadge(badge)}
                      className="flex-1"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBadge(badge.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreating || !!editingBadge} onOpenChange={() => {
        setIsCreating(false);
        setEditingBadge(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Create New Badge' : 'Edit Badge'}
            </DialogTitle>
            <DialogDescription>
              Configure badge details and requirements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Badge Name</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter badge name"
                />
              </div>
              <div>
                <Label>Icon (Emoji)</Label>
                <Input
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🏆"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter badge description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Requirement Type</Label>
                <select
                  value={formData.requirement_type || 'points'}
                  onChange={(e) => setFormData({ ...formData, requirement_type: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="points">Points</option>
                  <option value="activities">Activities</option>
                  <option value="special">Special</option>
                </select>
              </div>
              <div>
                <Label>Requirement Value</Label>
                <Input
                  type="number"
                  value={formData.requirement_value || 0}
                  onChange={(e) => setFormData({ ...formData, requirement_value: parseInt(e.target.value) })}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Rarity</Label>
                <select
                  value={formData.rarity || 'common'}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value as any })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
              <div>
                <Label>Category</Label>
                <select
                  value={formData.badge_category || 'achievement'}
                  onChange={(e) => setFormData({ ...formData, badge_category: e.target.value as any })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="achievement">Achievement</option>
                  <option value="campaign">Campaign</option>
                  <option value="event">Event</option>
                  <option value="milestone">Milestone</option>
                  <option value="recognition">Recognition</option>
                </select>
              </div>
              <div>
                <Label>Color</Label>
                <Input
                  value={formData.color || 'blue'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="blue"
                />
              </div>
            </div>

            {(formData.badge_category === 'event' || formData.badge_category === 'campaign') && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold text-sm">Event/Campaign Configuration</h4>
                
                <div>
                  <Label>Event Identifier (e.g., grenfell_2017, 7_7_2005)</Label>
                  <Input
                    value={formData.event_identifier || ''}
                    onChange={(e) => setFormData({ ...formData, event_identifier: e.target.value })}
                    placeholder="event_name_year"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Availability Start</Label>
                    <Input
                      type="datetime-local"
                      value={formData.availability_window_start || ''}
                      onChange={(e) => setFormData({ ...formData, availability_window_start: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Availability End</Label>
                    <Input
                      type="datetime-local"
                      value={formData.availability_window_end || ''}
                      onChange={(e) => setFormData({ ...formData, availability_window_end: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="limited"
                      checked={formData.limited_edition || false}
                      onChange={(e) => setFormData({ ...formData, limited_edition: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="limited">Limited Edition</Label>
                  </div>
                  <div>
                    <Label>Max Awards (optional)</Label>
                    <Input
                      type="number"
                      value={formData.max_awards || ''}
                      onChange={(e) => setFormData({ ...formData, max_awards: parseInt(e.target.value) || undefined })}
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verification"
                    checked={formData.verification_required || false}
                    onChange={(e) => setFormData({ ...formData, verification_required: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="verification">Requires Admin Verification</Label>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreating(false);
              setEditingBadge(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveBadge}>
              <Save className="h-4 w-4 mr-2" />
              Save Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgeManagementPanel;
