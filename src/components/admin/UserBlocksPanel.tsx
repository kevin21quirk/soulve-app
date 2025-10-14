import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserX, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserBlock {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocker_name?: string;
  blocker_email?: string;
  blocked_name?: string;
  blocked_email?: string;
}

const UserBlocksPanel = () => {
  const [blocks, setBlocks] = useState<UserBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlocks();

    const channel = supabase
      .channel('user-blocks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_blocks' }, () => {
        loadBlocks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBlocks = async () => {
    try {
      const { data: blocksData, error } = await supabase
        .from('user_blocks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with user profile data
      const enrichedBlocks = await Promise.all(
        (blocksData || []).map(async (block) => {
          // Fetch blocker profile
          const { data: blockerProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', block.blocker_id)
            .single();

          // Fetch blocked profile
          const { data: blockedProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', block.blocked_id)
            .single();

          // Get emails from auth
          const { data: { user: blockerUser } } = await supabase.auth.admin.getUserById(block.blocker_id);
          const { data: { user: blockedUser } } = await supabase.auth.admin.getUserById(block.blocked_id);

          return {
            ...block,
            blocker_name: blockerProfile ? `${blockerProfile.first_name} ${blockerProfile.last_name}`.trim() : 'Unknown',
            blocker_email: blockerUser?.email || 'Unknown',
            blocked_name: blockedProfile ? `${blockedProfile.first_name} ${blockedProfile.last_name}`.trim() : 'Unknown',
            blocked_email: blockedUser?.email || 'Unknown',
          };
        })
      );

      setBlocks(enrichedBlocks as UserBlock[]);
    } catch (error) {
      console.error('Error loading blocks:', error);
      toast.error('Failed to load user blocks');
    } finally {
      setLoading(false);
    }
  };

  const removeBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to remove this block? The users will be able to interact again.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;
      toast.success('Block removed successfully');
      loadBlocks();
    } catch (error) {
      console.error('Error removing block:', error);
      toast.error('Failed to remove block');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading blocks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-5 w-5" />
          User Blocks Management
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          View and manage user blocking relationships. Total blocks: {blocks.length}
        </p>
      </CardHeader>
      <CardContent>
        {blocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No user blocks found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blocker</TableHead>
                <TableHead>Blocked User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{block.blocker_name}</span>
                      <span className="text-xs text-muted-foreground">{block.blocker_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{block.blocked_name}</span>
                      <span className="text-xs text-muted-foreground">{block.blocked_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(block.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/profile/${block.blocker_id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Blocker
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/profile/${block.blocked_id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Blocked
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeBlock(block.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove Block
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBlocksPanel;
