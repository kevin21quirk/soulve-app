
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Heart, Clock, DollarSign, Users } from 'lucide-react';
import { useImpactTracking } from '@/hooks/useImpactTracking';

const ActivityTracker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activityType, setActivityType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hours: '',
    amount: '',
    organization: '',
    cause: ''
  });

  const { trackVolunteerWork, trackDonation, trackCommunityEngagement } = useImpactTracking();

  const handleSubmit = async () => {
    if (!activityType) return;

    try {
      switch (activityType) {
        case 'volunteer':
          if (formData.hours && formData.description) {
            await trackVolunteerWork(
              parseInt(formData.hours),
              formData.description,
              formData.organization
            );
          }
          break;
        case 'donation':
          if (formData.amount && formData.cause) {
            await trackDonation(
              parseFloat(formData.amount),
              formData.cause,
              formData.organization
            );
          }
          break;
        case 'community':
          if (formData.description) {
            await trackCommunityEngagement('manual_entry', formData.description);
          }
          break;
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        hours: '',
        amount: '',
        organization: '',
        cause: ''
      });
      setActivityType('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting activity:', error);
    }
  };

  const activityTypes = [
    { value: 'volunteer', label: 'Volunteer Work', icon: Clock, color: 'blue' },
    { value: 'donation', label: 'Donation', icon: DollarSign, color: 'green' },
    { value: 'community', label: 'Community Activity', icon: Users, color: 'purple' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Track Your Impact</span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Impact Activity</DialogTitle>
                <DialogDescription>
                  Track your volunteer work, donations, or community contributions
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activityType">Activity Type</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activityType === 'volunteer' && (
                  <>
                    <div>
                      <Label htmlFor="hours">Hours Volunteered</Label>
                      <Input
                        id="hours"
                        type="number"
                        value={formData.hours}
                        onChange={(e) => setFormData({...formData, hours: e.target.value})}
                        placeholder="e.g., 4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="What did you do?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization (Optional)</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        placeholder="e.g., Local Food Bank"
                      />
                    </div>
                  </>
                )}

                {activityType === 'donation' && (
                  <>
                    <div>
                      <Label htmlFor="amount">Amount Donated ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="e.g., 50.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cause">Cause/Purpose</Label>
                      <Input
                        id="cause"
                        value={formData.cause}
                        onChange={(e) => setFormData({...formData, cause: e.target.value})}
                        placeholder="e.g., Disaster Relief"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization (Optional)</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        placeholder="e.g., Red Cross"
                      />
                    </div>
                  </>
                )}

                {activityType === 'community' && (
                  <div>
                    <Label htmlFor="description">Community Activity</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe your community contribution"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    Record Activity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Manually record your impact activities to earn points and track your contributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activityTypes.map(type => (
            <Card key={type.value} className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-4 text-center">
                <type.icon className={`h-8 w-8 mx-auto mb-2 text-${type.color}-600`} />
                <h3 className="font-medium text-sm">{type.label}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {type.value === 'volunteer' && 'Earn 3 pts/hour'}
                  {type.value === 'donation' && 'Earn 0.1 pts/dollar'}
                  {type.value === 'community' && 'Earn 1-8 points'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTracker;
