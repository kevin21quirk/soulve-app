
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HelpRequest {
  id: string;
  title: string;
  content: string;
  category: string;
  urgency: string;
  location: string;
  tags: string[];
  created_at: string;
  is_active: boolean;
}

const MyHelpRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyHelpRequests();
    }
  }, [user]);

  const fetchMyHelpRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user?.id)
        .in('category', ['help_needed', 'volunteer'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setHelpRequests(data || []);
    } catch (error) {
      console.error('Error fetching help requests:', error);
      toast({
        title: "Error",
        description: "Failed to load your help requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_active: false })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Completed",
        description: "Your help request has been marked as completed",
      });

      fetchMyHelpRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating help request:', error);
      toast({
        title: "Error",
        description: "Failed to update help request",
        variant: "destructive"
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <AlertCircle className="h-4 w-4 text-orange-500" />
    ) : (
      <CheckCircle className="h-4 w-4 text-green-500" />
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (helpRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Help Requests Yet</h3>
          <p className="text-gray-600">
            You haven't created any help requests yet. Create your first one to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">My Help Requests</h3>
        <Badge variant="secondary">{helpRequests.length} total</Badge>
      </div>

      {helpRequests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(request.is_active)}
                  <CardTitle className="text-lg">{request.title}</CardTitle>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{request.content}</p>
              </div>
              <Badge className={getUrgencyColor(request.urgency)}>
                {request.urgency}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(request.created_at).toLocaleDateString()}</span>
                </div>
                {request.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{request.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{request.category.replace('_', ' ')}</span>
                </div>
              </div>
              
              {request.is_active && (
                <Button
                  onClick={() => markAsCompleted(request.id)}
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                >
                  Mark as Completed
                </Button>
              )}
            </div>
            
            {request.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {request.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyHelpRequests;
