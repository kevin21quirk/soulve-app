
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import CreatePostModal from "./post-creation/CreatePostModal";
import SocialPostCollapsed from "./post-creation/SocialPostCollapsed";
import { useUnifiedPostCreation } from "@/hooks/useUnifiedPostCreation";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const { createPost, isCreating } = useUnifiedPostCreation(onPostCreated);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sharedPost, setSharedPost] = useState<any>(null);

  const handlePostSubmit = async (data: any) => {
    console.log('CreatePost - Handling post submission:', data);
    
    try {
      const result = await createPost(data);
      console.log('CreatePost - Post created successfully:', result);
      
      setIsExpanded(false);
      setShowModal(false);
      setSharedPost(null); // Clear shared post after creating
    } catch (error) {
      console.error('CreatePost - Failed to create post:', error);
    }
  };

  // Listen for share events with enhanced debugging and error handling
  useEffect(() => {
    console.log('CreatePost - Setting up share event listener');
    
    const handleShareEvent = (event: CustomEvent) => {
      console.log('CreatePost - Share event received:', event.detail);
      
      try {
        if (!event.detail) {
          console.warn('CreatePost - No event detail provided');
          return;
        }

        const originalPost = event.detail.originalPost;
        
        if (!originalPost) {
          console.warn('CreatePost - No original post in share event');
          return;
        }
        
        console.log('CreatePost - Original post data:', originalPost);
        console.log('CreatePost - Setting shared post and opening modal');
        
        // Ensure we have the correct data structure with safe fallbacks
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
        
        console.log('CreatePost - Processed post data:', processedPost);
        setSharedPost(processedPost);
        setShowModal(true);
      } catch (error) {
        console.error('CreatePost - Error handling share event:', error);
      }
    };

    window.addEventListener('sharePost', handleShareEvent as EventListener);

    return () => {
      console.log('CreatePost - Cleaning up share event listener');
      window.removeEventListener('sharePost', handleShareEvent as EventListener);
    };
  }, []);

  // Debug modal state changes
  useEffect(() => {
    console.log('CreatePost - Modal state changed. showModal:', showModal, 'sharedPost:', sharedPost);
  }, [showModal, sharedPost]);

  if (!user) return null;

  return (
    <>
      <Card className="mb-6 border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                {user.user_metadata?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              className="flex-1 justify-start text-gray-500 hover:bg-white/60"
              onClick={() => {
                console.log('CreatePost - Manual create post button clicked');
                setShowModal(true);
              }}
              disabled={isCreating}
            >
              {isCreating ? "Creating post..." : "What's happening in your community?"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <SocialPostCollapsed onExpand={() => {
            console.log('CreatePost - Expand button clicked');
            setShowModal(true);
          }} />
        </CardContent>
      </Card>

      <CreatePostModal
        isOpen={showModal}
        onClose={() => {
          console.log('CreatePost - Closing modal and clearing shared post');
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
