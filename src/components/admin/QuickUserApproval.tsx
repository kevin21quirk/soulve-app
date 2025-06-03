
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuickUserApproval = () => {
  const [searchTerm, setSearchTerm] = useState('ricky endean');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const approveUser = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      // Search for user by name
      const { data: users, error: searchError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, waitlist_status')
        .ilike('first_name', `%${searchTerm.split(' ')[0]}%`)
        .ilike('last_name', `%${searchTerm.split(' ')[1] || ''}%`);

      if (searchError) throw searchError;

      if (!users || users.length === 0) {
        toast({
          title: "User not found",
          description: `No user found with name "${searchTerm}"`,
          variant: "destructive"
        });
        return;
      }

      const user = users[0];
      
      if (user.waitlist_status === 'approved') {
        toast({
          title: "Already approved",
          description: `${user.first_name} ${user.last_name} is already approved`,
        });
        return;
      }

      // Approve the user
      const { error: approveError } = await supabase
        .from('profiles')
        .update({ 
          waitlist_status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (approveError) throw approveError;

      toast({
        title: "User approved!",
        description: `${user.first_name} ${user.last_name} has been approved and can now access the platform`,
      });

    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Quick User Approval</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="Enter user name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={approveUser}
          disabled={loading || !searchTerm.trim()}
          className="w-full"
        >
          {loading ? 'Approving...' : 'Approve User'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickUserApproval;
