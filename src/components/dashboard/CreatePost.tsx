
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
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      author: "You",
      avatar: "",
      title: formData.title,
      description: formData.description,
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

    onPostCreated(newPost);
    
    // Reset form
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
    
    toast({
      title: "Post created!",
      description: `Your post has been shared with the community${taggedUsers.length > 0 ? ` and ${taggedUsers.length} user(s) have been tagged` : ''}.`,
    });
  };

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (template: any) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.template,
      category: template.category,
      urgency: template.urgency,
      tags: template.tags
    }));
    setShowTemplates(false);
    setShowAdvancedOptions(true);
  };

  const handleLocationSelect = (location: { address: string }) => {
    handleInputChange("location", location.address);
  };

  const handleTitleChange = (value: string, users: TaggedUser[]) => {
    handleInputChange("title", value);
    setTaggedUsers(users);
  };

  const handleDescriptionChange = (value: string, users: TaggedUser[]) => {
    handleInputChange("description", value);
    setTaggedUsers(users);
  };

  const handleShowTemplates = () => {
    setShowTemplates(true);
    setIsExpanded(true);
  };

  const handleExpandPost = () => {
    setIsExpanded(true);
  };

  const handleCollapsePost = () => {
    setIsExpanded(false);
  };

  const handleToggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const handleCancelTemplates = () => {
    setShowTemplates(false);
    setShowAdvancedOptions(true);
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
      onMediaChange={setMediaFiles}
      showAdvancedOptions={showAdvancedOptions}
      onToggleAdvancedOptions={handleToggleAdvancedOptions}
      onSubmit={handleSubmit}
      onCancel={handleCollapsePost}
    />
  );
};

export default CreatePost;
