import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Calendar, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImpactGoal, ImpactAnalyticsService } from '@/services/impactAnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GoalsManagerProps {
  goals: ImpactGoal[];
  onGoalsChange: (goals: ImpactGoal[]) => void;
}

const GoalsManager = ({ goals, onGoalsChange }: GoalsManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: 0,
    currentValue: 0,
    deadline: '',
    category: '',
    isActive: true
  });

  const handleCreateGoal = async () => {
    if (!user?.id || !newGoal.title || !newGoal.targetValue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const createdGoal = await ImpactAnalyticsService.createGoal(user.id, newGoal);
      onGoalsChange([...goals, createdGoal]);
      setNewGoal({
        title: '',
        description: '',
        targetValue: 0,
        currentValue: 0,
        deadline: '',
        category: '',
        isActive: true
      });
      setIsCreating(false);
      
      toast({
        title: "Goal Created! 🎯",
        description: "Your new impact goal has been set. Start making progress!",
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'helping': return 'bg-red-100 text-red-800';
      case 'volunteering': return 'bg-blue-100 text-blue-800';
      case 'trust': return 'bg-green-100 text-green-800';
      case 'donations': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-600" />
              <span>Impact Goals</span>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Impact Goal</DialogTitle>
                  <DialogDescription>
                    Set a personal goal to track your community impact progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="e.g., Help 50 people this month"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="Describe what you want to achieve..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target">Target Value</Label>
                      <Input
                        id="target"
                        type="number"
                        value={newGoal.targetValue}
                        onChange={(e) => setNewGoal({...newGoal, targetValue: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="current">Current Progress</Label>
                      <Input
                        id="current"
                        type="number"
                        value={newGoal.currentValue}
                        onChange={(e) => setNewGoal({...newGoal, currentValue: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 25"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="helping">Helping People</SelectItem>
                          <SelectItem value="volunteering">Volunteering</SelectItem>
                          <SelectItem value="trust">Trust Building</SelectItem>
                          <SelectItem value="donations">Donations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateGoal}
                      className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200"
                    >
                      Create Goal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Set and track personal impact goals to stay motivated
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progressPercentage = getProgressPercentage(goal.currentValue, goal.targetValue);
          const isCompleted = progressPercentage >= 100;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={goal.id} className={`hover:shadow-lg transition-shadow ${isCompleted ? 'ring-2 ring-green-200' : ''}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                    {goal.isActive && (
                      <Badge variant="outline" className="text-blue-700">
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {goal.currentValue} / {goal.targetValue}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="text-xs text-gray-500">
                      {Math.round(progressPercentage)}% complete
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                      </span>
                    </div>
                    {!isCompleted && (
                      <span className="text-blue-600 font-medium">
                        {goal.targetValue - goal.currentValue} to go
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Set Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first impact goal to start tracking your community contributions
            </p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalsManager;
