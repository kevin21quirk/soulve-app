import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Eye, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Organization {
  id: string;
  name: string;
  organization_type: string;
  verification_status: string;
  created_at: string;
  website?: string;
  description?: string;
}

const OrganizationVerificationPanel = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();

    const channel = supabase
      .channel('organizations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organizations' }, () => {
        loadOrganizations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (orgId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ 
          verification_status: status,
          verified_at: status === 'verified' ? new Date().toISOString() : null
        })
        .eq('id', orgId);

      if (error) throw error;
      toast.success(`Organization ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      verified: 'bg-green-500/10 text-green-700 border-green-500/20',
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
              <TableHead>Organization</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell className="capitalize">{org.organization_type?.replace('_', ' ')}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(org.verification_status)}>
                    {org.verification_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {org.website ? (
                    <a 
                      href={org.website} 
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
                  {new Date(org.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {org.verification_status !== 'verified' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleVerify(org.id, 'verified')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    {org.verification_status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleVerify(org.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrganizationVerificationPanel;
