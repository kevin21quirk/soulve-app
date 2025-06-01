import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PostCollapsedView from "./post-creation/PostCollapsedView";
import PostTemplateSelector from "./post-creation/PostTemplateSelector";
import PostFormSection from "./post-creation/PostFormSection";
import { PostFormData } from "./CreatePostTypes";
import { MediaFile } from "./media-upload/MediaUploadTypes";
import { useCreatePost } from "@/services/realPostsService";

interface TaggedUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { toast } = useToast();
  const createPostMutation = useCreatePost();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    urgency: "low",
    feeling: "",
    tags: [],
    visibility: "public",
    allowComments: true,
    allowSharing: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a description for your post.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Category required",
        description: "Please select a category for your post.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create post using the real service
      await createPostMutation.mutateAsync({
        title: formData.title.trim(),
        content: formData.description.trim(),
        category: formData.category,
        urgency: formData.urgency,
        location: formData.location,
        tags: formData.tags,
        visibility: formData.visibility,
      });

      // Reset form and state
      resetForm();
      
      // Notify parent component
      onPostCreated({ success: true });
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to create post",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      urgency: "low",
      feeling: "",
      tags: [],
      visibility: "public",
      allowComments: true,
      allowSharing: true,
    });
    setMediaFiles([]);
    setTaggedUsers([]);
    setIsExpanded(false);
    setShowTemplates(false);
  };

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    console.log("Form field changed:", field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (template: any) => {
    console.log("Template selected:", template);
    setFormData(prev => ({
      ...prev,
      title: template.title || prev.title,
      description: template.template || template.description || prev.description,
      category: template.category || prev.category,
      urgency: template.urgency || prev.urgency,
      tags: template.tags || prev.tags
    }));
    setShowTemplates(false);
  };

  const handleLocationSelect = (location: { address: string }) => {
    console.log("Location selected:", location);
    handleInputChange("location", location.address);
  };

  const handleTitleChange = (value: string, users: TaggedUser[]) => {
    console.log("Title changed:", value, "Tagged users:", users);
    handleInputChange("title", value);
    setTaggedUsers(prevUsers => {
      // Merge users from title and description
      const allUsers = [...prevUsers, ...users];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      );
      return uniqueUsers;
    });
  };

  const handleDescriptionChange = (value: string, users: TaggedUser[]) => {
    console.log("Description changed:", value, "Tagged users:", users);
    handleInputChange("description", value);
    setTaggedUsers(prevUsers => {
      // Merge users from title and description
      const allUsers = [...prevUsers, ...users];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      );
      return uniqueUsers;
    });
  };

  const handleShowTemplates = () => {
    console.log("Showing templates");
    setShowTemplates(true);
    setIsExpanded(true);
  };

  const handleExpandPost = () => {
    console.log("Expanding post form");
    setIsExpanded(true);
  };

  const handleCollapsePost = () => {
    console.log("Collapsing post form");
    setIsExpanded(false);
    setShowTemplates(false);
  };

  const handleToggleAdvancedOptions = () => {
    console.log("Showing templates");
    setShowTemplates(true);
  };

  const handleCancelTemplates = () => {
    console.log("Canceling template selection");
    setShowTemplates(false);
  };

  const handleMediaChange = (files: MediaFile[]) => {
    console.log("Media files changed:", files);
    setMediaFiles(files);
  };

  if (!isExpanded) {
    return (
      <PostCollapsedView
        onExpand={handleExpandPost}
        onShowTemplates={handleShowTemplates}
      />
    );
  }

  if (showTemplates) {
    return (
      <PostTemplateSelector
        onTemplateSelect={handleTemplateSelect}
        onCancel={handleCancelTemplates}
      />
    );
  }

  return (
    <PostFormSection
      formData={formData}
      onInputChange={handleInputChange}
      taggedUsers={taggedUsers}
      onTitleChange={handleTitleChange}
      onDescriptionChange={handleDescriptionChange}
      onLocationSelect={handleLocationSelect}
      mediaFiles={mediaFiles}
      onMediaChange={handleMediaChange}
      showAdvancedOptions={true}
      onToggleAdvancedOptions={handleToggleAdvancedOptions}
      onSubmit={handleSubmit}
      onCancel={handleCollapsePost}
    />
  );
};

export default CreatePost;
