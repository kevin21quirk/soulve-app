import { useState } from 'react';
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

interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirementType: 'points' | 'activities' | 'special';
  requirementValue: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const BadgeManagementPanel = () => {
  const { toast } = useToast();
  const [badges, setBadges] = useState<BadgeConfig[]>([
    {
      id: '1',
      name: 'First Helper',
      description: 'Complete your first help request',
      icon: '🌟',
      color: 'blue',
      requirementType: 'activities',
      requirementValue: 1,
      rarity: 'common',
    },
    {
      id: '2',
      name: 'Community Champion',
      description: 'Earn 1000 points',
      icon: '🏆',
      color: 'gold',
      requirementType: 'points',
      requirementValue: 1000,
      rarity: 'rare',
    },
    {
      id: '3',
      name: 'Safe Space Guardian',
      description: 'Complete 50 Safe Space sessions',
      icon: '🛡️',
      color: 'purple',
      requirementType: 'activities',
      requirementValue: 50,
      rarity: 'epic',
    },
  ]);

  const [editingBadge, setEditingBadge] = useState<BadgeConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<BadgeConfig>>({
    name: '',
    description: '',
    icon: '',
    color: 'blue',
    requirementType: 'points',
    requirementValue: 0,
    rarity: 'common',
  });

  const handleCreateBadge = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: 'blue',
      requirementType: 'points',
      requirementValue: 0,
      rarity: 'common',
    });
  };

  const handleEditBadge = (badge: BadgeConfig) => {
    setEditingBadge(badge);
    setFormData(badge);
  };

  const handleSaveBadge = () => {
    if (!formData.name || !formData.description || !formData.icon) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (isCreating) {
      const newBadge: BadgeConfig = {
        id: Date.now().toString(),
        ...formData as BadgeConfig,
      };
      setBadges([...badges, newBadge]);
      toast({
        title: 'Badge Created',
        description: 'New badge has been created successfully',
      });
    } else if (editingBadge) {
      setBadges(badges.map(b => b.id === editingBadge.id ? { ...editingBadge, ...formData } : b));
      toast({
        title: 'Badge Updated',
        description: 'Badge has been updated successfully',
      });
    }

    setIsCreating(false);
    setEditingBadge(null);
    setFormData({});
  };

  const handleDeleteBadge = (id: string) => {
    setBadges(badges.filter(b => b.id !== id));
    toast({
      title: 'Badge Deleted',
      description: 'Badge has been removed',
    });
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
                    <Badge className={getRarityColor(badge.rarity)} variant="secondary">
                      {badge.rarity}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Requirement: {badge.requirementType === 'points' ? `${badge.requirementValue} points` : `${badge.requirementValue} activities`}
                    </p>
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
                  value={formData.requirementType || 'points'}
                  onChange={(e) => setFormData({ ...formData, requirementType: e.target.value as any })}
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
                  value={formData.requirementValue || 0}
                  onChange={(e) => setFormData({ ...formData, requirementValue: parseInt(e.target.value) })}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label>Color</Label>
                <Input
                  value={formData.color || 'blue'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="blue"
                />
              </div>
            </div>
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
