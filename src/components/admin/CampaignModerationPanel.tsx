import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, Ban, CheckCircle, Flag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Campaign {
  id: string;
  title: string;
  creator_id: string;
  status: string;
  visibility: string;
  current_amount: number;
  goal_amount: number;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

const CampaignModerationPanel = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    loadCampaigns();

    const channel = supabase
      .channel('campaigns-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => {
        loadCampaigns();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch creator profiles separately
      if (data) {
        const creatorIds = [...new Set(data.map(c => c.creator_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', creatorIds);

        const campaignsWithProfiles = data.map(campaign => ({
          ...campaign,
          profiles: profilesData?.find(p => p.id === campaign.creator_id)
        }));

        setCampaigns(campaignsWithProfiles as any);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (campaignId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId);

      if (error) throw error;
      toast.success(`Campaign ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('Failed to update campaign');
    }
  };

  const handleUpdateVisibility = async (campaignId: string, visibility: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ visibility })
        .eq('id', campaignId);

      if (error) throw error;
      toast.success('Campaign visibility updated');
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignToDelete.id);

      if (error) throw error;
      toast.success(`Campaign "${campaignToDelete.title}" deleted permanently`);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-500/10 text-green-700 border-green-500/20',
      completed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      suspended: 'bg-red-500/10 text-red-700 border-red-500/20',
      draft: 'bg-gray-500/10 text-gray-700 border-gray-500/20'
    };
    return variants[status] || variants.draft;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading campaigns...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Campaign Moderation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell>
                  {campaign.profiles ? 
                    `${campaign.profiles.first_name} ${campaign.profiles.last_name}` : 
                    'Unknown'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {campaign.current_amount} / {campaign.goal_amount}
                </TableCell>
                <TableCell>
                  {new Date(campaign.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/campaigns/${campaign.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {campaign.status !== 'suspended' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(campaign.id, 'suspended')}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="gradient"
                        onClick={() => handleUpdateStatus(campaign.id, 'active')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setCampaignToDelete({ id: campaign.id, title: campaign.title });
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete "{campaignToDelete?.title}"? 
                This will delete:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>All donations and donation records</li>
                  <li>All participants and participant data</li>
                  <li>All comments and interactions</li>
                  <li>All analytics and tracking data</li>
                  <li>All campaign updates and media</li>
                </ul>
                <strong className="block mt-2 text-destructive">This action cannot be undone.</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCampaign}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default CampaignModerationPanel;
