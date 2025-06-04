
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Flag,
  MessageSquare,
  UserX
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  report_type: string;
  reason: string;
  status: string;
  created_at: string;
  reporter_id?: string;
  reported_user_id?: string;
  reported_post_id?: string;
}

interface Appeal {
  id: string;
  appeal_reason: string;
  status: string;
  created_at: string;
  user_id: string;
  report_id: string;
}

const AdminModerationDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
    fetchAppeals();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive"
      });
    }
  };

  const fetchAppeals = async () => {
    try {
      const { data, error } = await supabase
        .from('content_appeals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppeals(data || []);
    } catch (error) {
      console.error('Error fetching appeals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: action === 'approve' ? 'resolved' : 'dismissed',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Report ${action}d successfully`
      });

      fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive"
      });
    }
  };

  const handleAppealAction = async (appealId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('content_appeals')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', appealId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Appeal ${action}d successfully`
      });

      fetchAppeals();
    } catch (error) {
      console.error('Error updating appeal:', error);
      toast({
        title: "Error",
        description: "Failed to update appeal",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="outline" className="text-gray-600"><XCircle className="h-3 w-3 mr-1" />Dismissed</Badge>;
      case 'auto_blocked':
        return <Badge variant="outline" className="text-red-600"><AlertTriangle className="h-3 w-3 mr-1" />Auto Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'spam':
        return <MessageSquare className="h-4 w-4" />;
      case 'harassment':
        return <UserX className="h-4 w-4" />;
      case 'automated_filter':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
        <div className="flex space-x-4">
          <Badge variant="outline" className="text-red-600">
            {reports.filter(r => r.status === 'pending').length} Pending Reports
          </Badge>
          <Badge variant="outline" className="text-orange-600">
            {appeals.filter(a => a.status === 'pending').length} Pending Appeals
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="appeals">Appeals</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Content Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getReportTypeIcon(report.report_type)}
                        <span className="font-medium capitalize">
                          {report.report_type.replace('_', ' ')}
                        </span>
                        {getStatusBadge(report.status)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700">{report.reason}</p>
                    
                    {report.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleReportAction(report.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReportAction(report.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          View Content
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {reports.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No reports found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appeals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Content Appeals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appeals.map((appeal) => (
                  <div key={appeal.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Appeal #{appeal.id.slice(0, 8)}</span>
                        {getStatusBadge(appeal.status)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(appeal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700">{appeal.appeal_reason}</p>
                    
                    {appeal.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAppealAction(appeal.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve Appeal
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAppealAction(appeal.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject Appeal
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {appeals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No appeals found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminModerationDashboard;
