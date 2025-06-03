
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRealPostCreation } from "@/hooks/useRealPostCreation";
import SocialPostCollapsed from "./post-creation/SocialPostCollapsed";
import SocialPostComposer from "./post-creation/SocialPostComposer";
import PostTemplateSelector from "./post-creation/PostTemplateSelector";
import { PostFormData } from "./CreatePostTypes";

interface CreatePostProps {
  onPostCreated: (post: any) => void;
  onCancel?: () => void;
}

const CreatePost = ({ onPostCreated, onCancel }: CreatePostProps) => {
  const { toast } = useToast();
  const { createPost, isCreating } = useRealPostCreation();
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
      const postId = await createPost({
        title: formData.title || '',
        content: formData.description,
        category: formData.category,
        urgency: formData.urgency || 'medium',
        location: formData.location,
        tags: formData.tags || [],
        visibility: formData.visibility || 'public',
        media_urls: []
      });

      // Reset state
      setIsExpanded(false);
      setShowTemplates(false);
      
      // Notify parent component
      onPostCreated({ id: postId, success: true });
      
    } catch (error) {
      console.error('Error creating post:', error);
      // Error toast is already shown in the hook
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
    onCancel?.();
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
      isSubmitting={isCreating}
    />
  );
};

export default CreatePost;
