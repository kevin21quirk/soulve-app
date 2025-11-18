
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "@/contexts/AccountContext";
import CreatePostModal from "./post-creation/CreatePostModal";
import SocialPostCollapsed from "./post-creation/SocialPostCollapsed";
import { useUnifiedPostCreation } from "@/hooks/useUnifiedPostCreation";
import { supabase } from "@/integrations/supabase/client";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const { accountType, organizationId } = useAccount();
  const { createPost, isCreating } = useUnifiedPostCreation(onPostCreated);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sharedPost, setSharedPost] = useState<any>(null);
  const [orgData, setOrgData] = useState<{ name: string; avatar_url: string | null } | null>(null);

  // Fetch organization data when in organization context
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
      setIsExpanded(false);
      setShowModal(false);
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
        setShowModal(true);
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
      <div className="mb-6">
        {accountType === 'organization' && orgData && (
          <Badge variant="secondary" className="gap-1.5 mb-2">
            <Building className="h-3 w-3" />
            <span>Posting as {orgData.name}</span>
          </Badge>
        )}
        <SocialPostCollapsed onExpand={() => setShowModal(true)} />
      </div>

      <CreatePostModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSharedPost(null);
        }}
        onSubmit={handlePostSubmit}
        isSubmitting={isCreating}
        sharedPost={sharedPost}
      />
    </>
  );
};

export default CreatePost;
