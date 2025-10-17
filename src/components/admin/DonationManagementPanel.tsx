import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, RefreshCw, Download, Search, AlertCircle } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const DonationManagementPanel = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    recurring: 0,
    avgDonation: 0
  });

  useEffect(() => {
    loadDonations();
    
    // Real-time subscription
    const channel = supabase
      .channel('donation-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_donations' }, () => {
        loadDonations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_donations')
        .select(`
          *,
          campaigns:campaign_id (title),
          profiles:donor_id (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setDonations(data || []);

      // Calculate stats
      const total = data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
      
      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);
      
      const thisMonth = data?.filter(d => new Date(d.created_at) >= thisMonthStart)
        .reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
      
      const recurring = data?.filter(d => d.donation_type === 'recurring').length || 0;
      const avgDonation = data && data.length > 0 ? total / data.length : 0;

      setStats({ total, thisMonth, recurring, avgDonation });
    } catch (error) {
      console.error('Error loading donations:', error);
      toast({ title: 'Error', description: 'Failed to load donations', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Donor', 'Email', 'Campaign', 'Amount', 'Status', 'Recurring'];
    const rows = donations.map(d => [
      format(new Date(d.created_at), 'yyyy-MM-dd HH:mm'),
      `${d.profiles?.first_name || ''} ${d.profiles?.last_name || ''}`,
      d.profiles?.email || '',
      d.campaigns?.title || '',
      d.amount || 0,
      d.status || '',
      d.donation_type === 'recurring' ? 'Yes' : 'No'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const filteredDonations = donations.filter(d =>
    searchTerm === '' ||
    d.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.campaigns?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingState message="Loading donations..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donation Management</h1>
          <p className="text-muted-foreground">Track and manage platform donations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadDonations} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">£{stats.thisMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{format(new Date(), 'MMMM yyyy')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recurring Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.recurring}</div>
            <p className="text-xs text-muted-foreground">Active subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.avgDonation.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by donor name, email, or campaign..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations ({filteredDonations.length})</CardTitle>
          <CardDescription>All donation transactions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No donations found</p>
              </div>
            ) : (
              filteredDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">
                        {donation.profiles?.first_name} {donation.profiles?.last_name}
                      </h3>
                      {donation.donation_type === 'recurring' && (
                        <Badge variant="secondary">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Recurring
                        </Badge>
                      )}
                      <Badge className={
                        donation.status === 'completed' ? 'bg-green-500' :
                        donation.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }>
                        {donation.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{donation.profiles?.email}</p>
                      <p className="flex items-center gap-1">
                        Campaign: {donation.campaigns?.title || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">£{donation.amount?.toFixed(2) || '0.00'}</div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(donation.created_at), 'PPP')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};