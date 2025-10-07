import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, AlertTriangle, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SafeSpaceSession {
  id: string;
  requester_id: string;
  helper_id: string | null;
  issue_category: string;
  urgency_level: string;
  status: string;
  started_at: string;
  duration_minutes: number | null;
  created_at: string;
  ended_at: string;
}

interface SessionMessage {
  id: string;
  sender_role: string;
  content: string;
  created_at: string;
}

export const ActiveSessionsMonitor = () => {
  const [sessions, setSessions] = useState<SafeSpaceSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveSessions();
    
    // Subscribe to session changes
    const channel = supabase
      .channel('active-sessions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'safe_space_sessions'
      }, () => {
        fetchActiveSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchSessionMessages(selectedSession);
    }
  }, [selectedSession]);

  const fetchActiveSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('safe_space_sessions')
        .select('*')
        .eq('status', 'active')
        .order('started_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch active sessions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('safe_space_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch session messages',
        variant: 'destructive'
      });
    }
  };

  const getSessionDuration = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - start.getTime()) / 60000);
    return diffMinutes;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return <div className="p-8">Loading active sessions...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Eye className="h-8 w-8 text-blue-600" />
            Active Sessions Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of ongoing Safe Space sessions
          </p>
        </div>
        <Button onClick={fetchActiveSessions} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions ({sessions.length})</CardTitle>
            <CardDescription>Click a session to view conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No active sessions</p>
                ) : (
                  sessions.map(session => {
                    const duration = getSessionDuration(session.started_at);
                    const isLongSession = duration > 120; // 2 hours

                    return (
                      <Card 
                        key={session.id}
                        className={`cursor-pointer transition-all ${selectedSession === session.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setSelectedSession(session.id)}
                      >
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge className={getUrgencyColor(session.urgency_level)}>
                              {session.urgency_level}
                            </Badge>
                            {isLongSession && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Long Session
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm">
                            <p className="font-semibold">{session.issue_category.replace(/_/g, ' ')}</p>
                            <p className="text-muted-foreground text-xs">
                              Duration: {duration} minutes
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Session: {session.id.substring(0, 8)}...
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Viewer */}
        <Card>
          <CardHeader>
            <CardTitle>Session Messages</CardTitle>
            <CardDescription>
              {selectedSession ? 'Read-only view for safeguarding review' : 'Select a session to view messages'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedSession ? (
              <div className="text-center text-muted-foreground py-8">
                Select a session from the left to view messages
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground">No messages yet</p>
                  ) : (
                    messages.map(message => (
                      <div 
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.sender_role === 'helper' 
                            ? 'bg-blue-50 ml-8' 
                            : 'bg-muted mr-8'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3 w-3" />
                          <span className="text-xs font-semibold">
                            {message.sender_role === 'helper' ? 'Helper' : 'User'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Privacy Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            This read-only view is for safeguarding purposes only under UK law. 
            Access is logged and audited. Only view sessions when there is a legitimate 
            safeguarding concern or emergency alert.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};