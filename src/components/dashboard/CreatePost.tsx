
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import CreatePostModal from "./post-creation/CreatePostModal";
import SocialPostCollapsed from "./post-creation/SocialPostCollapsed";
import { useCreatePost } from "@/hooks/useCreatePost";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const { createPost, isSubmitting } = useCreatePost();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handlePostSubmit = async (data: any) => {
    try {
      await createPost(data);
      setIsExpanded(false);
      setShowModal(false);
      onPostCreated?.();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

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
              onClick={() => setShowModal(true)}
            >
              What's happening in your community?
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <SocialPostCollapsed onExpand={() => setShowModal(true)} />
        </CardContent>
      </Card>

      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePostSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default CreatePost;
