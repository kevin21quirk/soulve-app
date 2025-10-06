import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotificationCounts } from '@/hooks/useNotificationCounts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Trash2 } from 'lucide-react';

/**
 * Debug panel to help diagnose notification badge issues
 * Shows actual unread messages and provides actions to fix discrepancies
 */
export const DebugNotificationPanel = () => {
  const { user } = useAuth();
  const { counts, refreshCounts, markMessagesAsRead } = useNotificationCounts();
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUnreadMessages = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, sender_id, created_at, is_read')
        .eq('recipient_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading unread messages:', error);
      } else {
        setUnreadMessages(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllUnread = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error clearing unread messages:', error);
      } else {
        await loadUnreadMessages();
        refreshCounts();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Notification Debug Panel</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              loadUnreadMessages();
              refreshCounts();
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Messages Badge Count</div>
            <div className="text-2xl font-bold">{counts.messages}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Notifications</div>
            <div className="text-2xl font-bold">{counts.total}</div>
          </div>
        </div>

        {unreadMessages.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Unread Messages ({unreadMessages.length})
              </h3>
              <Button
                size="sm"
                variant="destructive"
                onClick={clearAllUnread}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {unreadMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 bg-gray-50 rounded border text-sm"
                >
                  <div className="font-medium">Message ID: {msg.id}</div>
                  <div className="text-gray-600 truncate">
                    Content: {msg.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    From: {msg.sender_id} | {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {unreadMessages.length === 0 && counts.messages === 0 && (
          <div className="text-center py-8 text-gray-500">
            ✓ No unread messages - badge should be hidden
          </div>
        )}

        {unreadMessages.length === 0 && counts.messages > 0 && (
          <div className="text-center py-8 text-orange-600">
            ⚠️ Discrepancy detected: Badge shows {counts.messages} but no
            unread messages found
          </div>
        )}
      </CardContent>
    </Card>
  );
};
