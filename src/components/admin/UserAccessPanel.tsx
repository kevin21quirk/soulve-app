
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search, UserPlus, Clock, CheckCircle } from 'lucide-react';

interface PendingUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  waitlist_status: string;
}

const UserAccessPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [granting, setGranting] = useState<string | null>(null);

  // Check if user is admin (developer override)
  const isAdmin = user?.id === 'f13567a6-7606-48ef-9333-dd661199eaf1';

  useEffect(() => {
    if (isAdmin) {
      fetchPendingUsers();
    }
  }, [isAdmin]);

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, created_at, waitlist_status')
        .eq('waitlist_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Get emails from auth.users for these profile IDs
      const userIds = data?.map(p => p.id) || [];
      if (userIds.length > 0) {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        const usersWithEmails = data?.map(profile => {
          const authUser = authData.users.find((u: any) => u.id === profile.id);
          return {
            ...profile,
            email: authUser?.email || 'Unknown'
          };
        }) || [];

        setPendingUsers(usersWithEmails);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const grantAccess = async (userId: string, userEmail: string) => {
    setGranting(userId);
    try {
      const { error } = await supabase.rpc('approve_waitlist_user', {
        target_user_id: userId,
        approving_admin_id: user?.id
      });

      if (error) throw error;

      toast({
        title: "Access Granted",
        description: `${userEmail} now has access to the platform`,
      });

      // Remove from pending list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error granting access:', error);
      toast({
        title: "Error",
        description: "Failed to grant access. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGranting(null);
    }
  };

  const searchUserByEmail = async () => {
    if (!searchEmail.trim()) return;

    try {
      // Search in auth.users first
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      const foundUser = authData.users.find((u: any) => 
        u.email?.toLowerCase().includes(searchEmail.toLowerCase())
      );

      if (!foundUser) {
        toast({
          title: "User Not Found",
          description: "No user found with that email",
          variant: "destructive"
        });
        return;
      }

      // Check if they already have access
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('waitlist_status')
        .eq('id', foundUser.id)
        .single();

      if (profileError) {
        toast({
          title: "Error",
          description: "Could not check user status",
          variant: "destructive"
        });
        return;
      }

      if (profileData.waitlist_status === 'approved') {
        toast({
          title: "Already Approved",
          description: "This user already has access",
        });
        return;
      }

      // Grant access immediately
      await grantAccess(foundUser.id, foundUser.email || 'Unknown');
      setSearchEmail('');
    } catch (error) {
      console.error('Error searching user:', error);
      toast({
        title: "Error",
        description: "Failed to search for user",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Admin: User Access Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Search */}
        <div className="space-y-2">
          <h3 className="font-medium">Grant Access by Email</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter user email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUserByEmail()}
            />
            <Button onClick={searchUserByEmail} disabled={!searchEmail.trim()}>
              <Search className="h-4 w-4 mr-1" />
              Grant Access
            </Button>
          </div>
        </div>

        {/* Pending Users */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recent Pending Users</h3>
            <Button variant="outline" size="sm" onClick={fetchPendingUsers}>
              Refresh
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No pending users found
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      Signed up: {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => grantAccess(user.id, user.email)}
                      disabled={granting === user.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {granting === user.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Granting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Grant Access
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAccessPanel;
