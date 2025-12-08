import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Eye, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OrganizationVerification {
  id: string;
  user_id: string;
  verification_type: string;
  status: string;
  verification_data: {
    organizationName?: string;
    organizationType?: string;
    website?: string;
    description?: string;
    registrationNumber?: string;
  };
  created_at: string;
  verified_at?: string;
  verified_by?: string;
  notes?: string;
  user_email?: string;
  user_name?: string;
}

const OrganizationVerificationPanel = () => {
  const [verifications, setVerifications] = useState<OrganizationVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerifications();

    const channel = supabase
      .channel('org-verifications-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_verifications',
        filter: 'verification_type=eq.organization'
      }, () => {
        loadVerifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadVerifications = async () => {
    try {
      // Fetch organization verification requests from user_verifications table
      const { data: verificationsData, error } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('verification_type', 'organization')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with user profile data
      const enrichedVerifications = await Promise.all(
        (verificationsData || []).map(async (verification) => {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', verification.user_id)
            .single();

          // Get user email from auth
          const { data: { user } } = await supabase.auth.admin.getUserById(verification.user_id);

          return {
            ...verification,
            user_email: user?.email || 'Unknown',
            user_name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown'
          };
        })
      );

      setVerifications(enrichedVerifications as OrganizationVerification[]);
    } catch (error) {
      console.error('Error loading organization verifications:', error);
      toast.error('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (verificationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('user_verifications')
        .update({ 
          status: newStatus,
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', verificationId);

      if (error) throw error;
      toast.success(`Organization verification ${newStatus} successfully`);
      loadVerifications();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast.error('Failed to update verification');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      approved: 'bg-green-500/10 text-green-700 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      rejected: 'bg-red-500/10 text-red-700 border-red-500/20'
    };
    return variants[status] || variants.pending;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading organizations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Organization Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Organization Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No organization verification requests found
                </TableCell>
              </TableRow>
            ) : (
              verifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{verification.user_name}</span>
                      <span className="text-xs text-muted-foreground">{verification.user_email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {verification.verification_data?.organizationName || 'N/A'}
                  </TableCell>
                  <TableCell className="capitalize">
                    {verification.verification_data?.organizationType?.replace('_', ' ') || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(verification.status)}>
                      {verification.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {verification.verification_data?.website ? (
                      <a 
                        href={verification.verification_data.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Visit
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(verification.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {verification.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="gradient"
                            onClick={() => handleVerify(verification.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleVerify(verification.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {verification.status !== 'pending' && (
                        <span className="text-sm text-muted-foreground">
                          {verification.status === 'approved' ? 'Approved' : 'Rejected'} {verification.verified_at ? `on ${new Date(verification.verified_at).toLocaleDateString()}` : ''}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrganizationVerificationPanel;
