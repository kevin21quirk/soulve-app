
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PostCollapsedView from "./post-creation/PostCollapsedView";
import PostTemplateSelector from "./post-creation/PostTemplateSelector";
import PostFormSection from "./post-creation/PostFormSection";
import { PostFormData } from "./CreatePostTypes";
import { MediaFile } from "./media-upload/MediaUploadTypes";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
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

    const newPost = {
      id: Date.now().toString(),
      author: "You",
      avatar: "",
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category as "help-needed" | "help-offered" | "success-story",
      timestamp: formData.scheduledFor ? `Scheduled for ${formData.scheduledFor.toLocaleDateString()}` : "Just now",
      location: formData.location || "Your area",
      responses: 0,
      likes: 0,
      isLiked: false,
      urgency: formData.urgency,
      feeling: formData.feeling,
      tags: formData.tags,
      visibility: formData.visibility,
      allowComments: formData.allowComments,
      allowSharing: formData.allowSharing,
      taggedUsers: taggedUsers,
      media: mediaFiles.map(file => ({
        id: file.id,
        type: file.type,
        url: file.preview,
        filename: file.file.name
      }))
    };

    console.log("Creating post:", newPost);
    onPostCreated(newPost);
    
    // Reset form and state
    resetForm();
    
    toast({
      title: "Post created successfully!",
      description: `Your post has been shared with the community${taggedUsers.length > 0 ? ` and ${taggedUsers.length} user(s) have been tagged` : ''}.`,
    });
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
    setShowAdvancedOptions(false);
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
    setShowAdvancedOptions(true);
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
    setShowAdvancedOptions(false);
  };

  const handleToggleAdvancedOptions = () => {
    console.log("Toggling advanced options");
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const handleCancelTemplates = () => {
    console.log("Canceling template selection");
    setShowTemplates(false);
    setShowAdvancedOptions(false);
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
      showAdvancedOptions={showAdvancedOptions}
      onToggleAdvancedOptions={handleToggleAdvancedOptions}
      onSubmit={handleSubmit}
      onCancel={handleCollapsePost}
    />
  );
};

export default CreatePost;
