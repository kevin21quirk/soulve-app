import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ShieldAlert, AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface EmergencyAlert {
  id: string;
  session_id: string;
  message_id: string | null;
  alert_type: string;
  severity: string;
  risk_score: number;
  detected_keywords: string[];
  ai_analysis: any;
  status: string;
  assigned_to: string | null;
  acknowledged_at: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
}

export const SafeguardingAlertsDashboard = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    
    // Subscribe to real-time alerts
    const channel = supabase
      .channel('emergency-alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'safe_space_emergency_alerts'
      }, (payload) => {
        setAlerts(prev => [payload.new as EmergencyAlert, ...prev]);
        toast({
          title: '🚨 New Emergency Alert',
          description: `${(payload.new as EmergencyAlert).severity.toUpperCase()} severity alert received`,
          variant: 'destructive'
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('safe_space_emergency_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch emergency alerts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('safe_space_emergency_alerts')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          assigned_to: user?.id
        })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'acknowledged', acknowledged_at: new Date().toISOString() }
          : alert
      ));

      toast({
        title: 'Alert Acknowledged',
        description: 'You have been assigned to this alert'
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert',
        variant: 'destructive'
      });
    }
  };

  const resolveAlert = async (alertId: string) => {
    if (!resolutionNotes.trim()) {
      toast({
        title: 'Resolution Notes Required',
        description: 'Please provide notes about how this alert was resolved',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('safe_space_emergency_alerts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_notes: resolutionNotes
        })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'resolved', resolved_at: new Date().toISOString(), resolution_notes: resolutionNotes }
          : alert
      ));

      setSelectedAlert(null);
      setResolutionNotes('');

      toast({
        title: 'Alert Resolved',
        description: 'Alert has been marked as resolved'
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve alert',
        variant: 'destructive'
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'acknowledged': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'reviewing': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const filterAlerts = (status: string) => {
    if (status === 'all') return alerts;
    if (status === 'active') return alerts.filter(a => ['pending', 'acknowledged', 'reviewing'].includes(a.status));
    return alerts.filter(a => a.status === status);
  };

  if (loading) {
    return <div className="p-8">Loading alerts...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-red-600" />
            Emergency Alerts Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and respond to critical Safe Space alerts
          </p>
        </div>
        <Button onClick={fetchAlerts} variant="outline">
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({filterAlerts('active').length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterAlerts('pending').length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({filterAlerts('resolved').length})</TabsTrigger>
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
        </TabsList>

        {['active', 'pending', 'resolved', 'all'].map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filterAlerts(status).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No {status} alerts found
                </CardContent>
              </Card>
            ) : (
              filterAlerts(status).map(alert => (
                <Card key={alert.id} className="border-l-4" style={{
                  borderLeftColor: alert.severity === 'critical' ? '#dc2626' : 
                                  alert.severity === 'high' ? '#ea580c' : '#eab308'
                }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          {alert.alert_type.replace(/_/g, ' ').toUpperCase()}
                        </CardTitle>
                        <CardDescription>
                          Session ID: {alert.session_id.substring(0, 8)}... | 
                          Created: {new Date(alert.created_at).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          Risk: {alert.risk_score}/100
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {alert.detected_keywords.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Detected Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {alert.detected_keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="destructive">{keyword}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {alert.ai_analysis && Object.keys(alert.ai_analysis).length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2">AI Analysis:</p>
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(alert.ai_analysis, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    {alert.resolution_notes && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Resolution Notes:</p>
                        <p className="text-sm bg-green-50 p-3 rounded-md">{alert.resolution_notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      {alert.status === 'pending' && (
                        <Button onClick={() => acknowledgeAlert(alert.id)} variant="outline">
                          Acknowledge & Assign to Me
                        </Button>
                      )}
                      {['pending', 'acknowledged', 'reviewing'].includes(alert.status) && (
                        <Button onClick={() => setSelectedAlert(alert)} variant="default">
                          Resolve Alert
                        </Button>
                      )}
                      <Button variant="ghost" asChild>
                        <a href={`/admin/safeguarding/sessions?session=${alert.session_id}`}>
                          View Session
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Resolution Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Resolve Alert</CardTitle>
              <CardDescription>
                Provide details about how this alert was handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Alert Details:</p>
                <p className="text-sm text-muted-foreground">
                  Type: {selectedAlert.alert_type} | Severity: {selectedAlert.severity} | Risk: {selectedAlert.risk_score}/100
                </p>
              </div>
              <Textarea
                placeholder="Enter resolution notes (required)..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setSelectedAlert(null);
                  setResolutionNotes('');
                }}>
                  Cancel
                </Button>
                <Button onClick={() => resolveAlert(selectedAlert.id)}>
                  Mark as Resolved
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};