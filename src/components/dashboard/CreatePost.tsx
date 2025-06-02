
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import SocialPostCollapsed from "./post-creation/SocialPostCollapsed";
import SocialPostComposer from "./post-creation/SocialPostComposer";
import PostTemplateSelector from "./post-creation/PostTemplateSelector";
import { PostFormData } from "./CreatePostTypes";
import { useCreatePost } from "@/services/realPostsService";

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { toast } = useToast();
  const createPostMutation = useCreatePost();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = async (formData: PostFormData) => {
    // Validate required fields
    if (!formData.description.trim()) {
      toast({
        title: "Content required",
        description: "Please write something to share.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Category required",
        description: "Please select what kind of post this is.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create post using the real service
      await createPostMutation.mutateAsync({
        title: formData.title.trim() || formData.description.split('\n')[0].substring(0, 50),
        content: formData.description.trim(),
        category: formData.category,
        urgency: formData.urgency,
        location: formData.location,
        tags: formData.tags,
        visibility: formData.visibility,
      });

      // Reset state
      setIsExpanded(false);
      setShowTemplates(false);
      
      // Notify parent component
      onPostCreated({ success: true });
      
      toast({
        title: "Post shared! ✨",
        description: "Your post has been shared with the community.",
      });
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to share post",
        description: "There was an error sharing your post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTemplateSelect = (template: any) => {
    console.log("Template selected:", template);
    setShowTemplates(false);
    setIsExpanded(true);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setShowTemplates(false);
  };

  const handleShowTemplates = () => {
    setShowTemplates(true);
  };

  const handleCancelTemplates = () => {
    setShowTemplates(false);
  };

  if (showTemplates) {
    return (
      <PostTemplateSelector
        onTemplateSelect={handleTemplateSelect}
        onCancel={handleCancelTemplates}
      />
    );
  }

  if (!isExpanded) {
    return <SocialPostCollapsed onExpand={handleExpand} />;
  }

  return (
    <SocialPostComposer
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isExpanded={isExpanded}
    />
  );
};

export default CreatePost;
