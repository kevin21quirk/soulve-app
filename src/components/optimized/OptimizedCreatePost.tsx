
import React, { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import CreatePostModal from "../dashboard/post-creation/CreatePostModal";
import SocialPostCollapsed from "../dashboard/post-creation/SocialPostCollapsed";
import { useOptimizedPostCreation } from "@/hooks/useOptimizedPostCreation";

interface OptimizedCreatePostProps {
  onPostCreated?: () => void;
}

const OptimizedCreatePost = memo(({ onPostCreated }: OptimizedCreatePostProps) => {
  const { user } = useAuth();
  const { createPost, isSubmitting } = useOptimizedPostCreation();
  const [showModal, setShowModal] = useState(false);
  const [sharedPost, setSharedPost] = useState<any>(null);

  const handlePostSubmit = useCallback(async (data: any) => {
    console.log('OptimizedCreatePost - Handling post submission:', data);
    
    try {
      const result = await createPost(data);
      console.log('OptimizedCreatePost - Post created successfully:', result);
      
      setShowModal(false);
      setSharedPost(null);
      onPostCreated?.();
    } catch (error) {
      console.error('OptimizedCreatePost - Failed to create post:', error);
    }
  }, [createPost, onPostCreated]);

  const handleOpenModal = useCallback(() => {
    console.log('OptimizedCreatePost - Opening modal');
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log('OptimizedCreatePost - Closing modal');
    setShowModal(false);
    setSharedPost(null);
  }, []);

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
              onClick={handleOpenModal}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating post..." : "What's happening in your community?"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <SocialPostCollapsed onExpand={handleOpenModal} />
        </CardContent>
      </Card>

      <CreatePostModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handlePostSubmit}
        isSubmitting={isSubmitting}
        sharedPost={sharedPost}
      />
    </>
  );
});

OptimizedCreatePost.displayName = 'OptimizedCreatePost';

export default OptimizedCreatePost;
