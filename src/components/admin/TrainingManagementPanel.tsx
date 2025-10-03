import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface TrainingProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: string;
  score: number | null;
  attempts: number;
  time_spent_minutes: number;
  answers: any;
  last_attempt_at: string | null;
  completed_at: string | null;
}

const TrainingManagementPanel = () => {
  const { toast } = useToast();
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { first_name: string; last_name: string }>>({});
  const [modules, setModules] = useState<Record<string, { title: string; category: string }>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProgress, setSelectedProgress] = useState<TrainingProgress | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [manualScore, setManualScore] = useState<number>(0);

  useEffect(() => {
    loadTrainingProgress();
  }, []);

  const loadTrainingProgress = async () => {
    setLoading(true);
    try {
      // Load training progress
      const { data: progressData, error: progressError } = await supabase
        .from('safe_space_helper_training_progress')
        .select('*')
        .order('last_attempt_at', { ascending: false, nullsFirst: false });

      if (progressError) throw progressError;

      // Load profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');

      if (profilesError) throw profilesError;

      // Load modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('safe_space_training_modules')
        .select('id, title, category');

      if (modulesError) throw modulesError;

      // Create lookup maps
      const profilesMap: Record<string, { first_name: string; last_name: string }> = {};
      profilesData?.forEach((p) => {
        profilesMap[p.id] = { first_name: p.first_name || '', last_name: p.last_name || '' };
      });

      const modulesMap: Record<string, { title: string; category: string }> = {};
      modulesData?.forEach((m) => {
        modulesMap[m.id] = { title: m.title, category: m.category };
      });

      setProfiles(profilesMap);
      setModules(modulesMap);
      setTrainingProgress(progressData || []);
    } catch (error) {
      console.error('Error loading training progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to load training progress',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualReview = async () => {
    if (!selectedProgress) return;

    try {
      const { error } = await supabase
        .from('safe_space_helper_training_progress')
        .update({
          score: manualScore,
          status: manualScore >= 80 ? 'completed' : 'failed',
          completed_at: manualScore >= 80 ? new Date().toISOString() : null,
        })
        .eq('id', selectedProgress.id);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_action_log').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'manual_training_review',
        target_user_id: selectedProgress.user_id,
        details: {
          module_id: selectedProgress.module_id,
          manual_score: manualScore,
          notes: reviewNotes,
        },
      });

      toast({
        title: 'Review Submitted',
        description: 'Training progress has been manually reviewed',
      });

      setSelectedProgress(null);
      setReviewNotes('');
      loadTrainingProgress();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };

  const filteredProgress = trainingProgress.filter((progress) => {
    const profile = profiles[progress.user_id];
    const module = modules[progress.module_id];
    
    const matchesSearch =
      !searchTerm ||
      profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || progress.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Training Management</CardTitle>
          <CardDescription>
            Monitor and manually review helper training progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or module..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProgress.map((progress) => {
                    const profile = profiles[progress.user_id];
                    const module = modules[progress.module_id];
                    
                    return (
                      <TableRow key={progress.id}>
                        <TableCell>
                          {profile?.first_name} {profile?.last_name}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{module?.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {module?.category}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(progress.status)}</TableCell>
                        <TableCell>{progress.score !== null ? `${progress.score}%` : 'N/A'}</TableCell>
                        <TableCell>{progress.attempts}</TableCell>
                        <TableCell>{progress.time_spent_minutes} min</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProgress(progress);
                              setManualScore(progress.score || 0);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProgress} onOpenChange={() => setSelectedProgress(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manual Training Review</DialogTitle>
            <DialogDescription>
              Review and manually assess training progress
            </DialogDescription>
          </DialogHeader>

          {selectedProgress && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">User</label>
                  <p className="text-sm text-muted-foreground">
                    {profiles[selectedProgress.user_id]?.first_name}{' '}
                    {profiles[selectedProgress.user_id]?.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Module</label>
                  <p className="text-sm text-muted-foreground">
                    {modules[selectedProgress.module_id]?.title}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Status</label>
                  <p className="text-sm">{getStatusBadge(selectedProgress.status)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Score</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedProgress.score !== null ? `${selectedProgress.score}%` : 'Not scored'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Answers</label>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-40">
                  {JSON.stringify(selectedProgress.answers, null, 2)}
                </pre>
              </div>

              <div>
                <label className="text-sm font-medium">Manual Score Override</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={manualScore}
                  onChange={(e) => setManualScore(Number(e.target.value))}
                  placeholder="Enter score (0-100)"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add any notes about this manual review..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProgress(null)}>
              Cancel
            </Button>
            <Button onClick={handleManualReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingManagementPanel;
