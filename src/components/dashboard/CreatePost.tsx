import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "@/contexts/AccountContext";
import { useUnifiedPostCreation } from "@/hooks/useUnifiedPostCreation";
import { supabase } from "@/integrations/supabase/client";
import ModernPostComposer from "@/components/post-creation/ModernPostComposer";

interface CreatePostProps {
  onPostCreated?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreatePost = ({ onPostCreated, isOpen, onOpenChange }: CreatePostProps) => {
  const { user } = useAuth();
  const { accountType, organizationId } = useAccount();
  const { createPost, isCreating } = useUnifiedPostCreation(onPostCreated);
  const [showModal, setShowModal] = useState(false);
  const [sharedPost, setSharedPost] = useState<any>(null);
  const [orgData, setOrgData] = useState<{
    name: string;
    avatar_url: string | null;
  } | null>(null);

  // Sync external isOpen prop with internal state
  useEffect(() => {
    if (isOpen !== undefined) {
      setShowModal(isOpen);
    }
  }, [isOpen]);

  // Notify parent when modal state changes
  const handleModalChange = (open: boolean) => {
    setShowModal(open);
    onOpenChange?.(open);
  };

  useEffect(() => {
    const fetchOrgData = async () => {
      if (accountType === 'organization' && organizationId) {
        const { data } = await supabase
          .from('organizations')
          .select('name, avatar_url')
          .eq('id', organizationId)
          .single();
        if (data) {
          setOrgData(data);
        }
      } else {
        setOrgData(null);
      }
    };
    fetchOrgData();
  }, [accountType, organizationId]);

  const handlePostSubmit = async (data: any) => {
    try {
      await createPost(data);
      handleModalChange(false);
      setSharedPost(null);
    } catch (error) {
      // Error is handled by useUnifiedPostCreation hook
    }
  };

  // Listen for share events
  useEffect(() => {
    const handleShareEvent = (event: CustomEvent) => {
      try {
        if (!event.detail?.originalPost) return;
        const originalPost = event.detail.originalPost;
        const processedPost = {
          id: originalPost.id || '',
          author: originalPost.author || 'Unknown Author',
          title: originalPost.title || 'Untitled Post',
          description: originalPost.description || '',
          category: originalPost.category || 'announcement',
          avatar: originalPost.avatar || '',
          location: originalPost.location || '',
          tags: Array.isArray(originalPost.tags) ? originalPost.tags : []
        };
        setSharedPost(processedPost);
        handleModalChange(true);
      } catch (error) {
        // Silent error handling for share events
      }
    };
    window.addEventListener('sharePost', handleShareEvent as EventListener);
    return () => window.removeEventListener('sharePost', handleShareEvent as EventListener);
  }, []);

  if (!user) return null;

  return (
    <>
      <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/10 hover:shadow-md transition-shadow">
        <CardHeader className="py-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={orgData?.avatar_url || user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-primary/60 text-primary-foreground font-bold">
                {orgData?.name?.charAt(0) || user.user_metadata?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              {accountType === 'organization' && orgData && (
                <Badge variant="secondary" className="gap-1.5 mb-1">
                  <Building className="h-3 w-3" />
                  <span>Posting as {orgData.name}</span>
                </Badge>
              )}
              <Button 
                variant="outline" 
                className="w-full justify-start text-muted-foreground hover:bg-background/60 hover:text-foreground transition-colors" 
                onClick={() => handleModalChange(true)} 
                disabled={isCreating}
              >
                {isCreating ? "Creating post..." : "What's happening in your community?"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <ModernPostComposer
        isOpen={showModal}
        onClose={() => {
          handleModalChange(false);
          setSharedPost(null);
        }}
        onSubmit={handlePostSubmit}
        isSubmitting={isCreating}
      />
    </>
  );
};

export default CreatePost;
