
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MediaUpload from "./MediaUpload";
import PostOptions from "./PostOptions";
import UserTagging from "./tagging/UserTagging";
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
    
    toast({
      title: "Post created!",
      description: `Your post has been shared with the community${taggedUsers.length > 0 ? ` and ${taggedUsers.length} user(s) have been tagged` : ''}.`,
    });
  };

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaChange = (files: MediaFile[]) => {
    setMediaFiles(files);
  };

  const handleTitleChange = (value: string, users: TaggedUser[]) => {
    handleInputChange("title", value);
    setTaggedUsers(users);
  };

  const handleDescriptionChange = (value: string, users: TaggedUser[]) => {
    handleInputChange("description", value);
    setTaggedUsers(users);
  };

  if (!isExpanded) {
    return (
      <Card className="mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsExpanded(true)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 text-gray-500">
            <span>Share something with your community... (Type @ to tag someone)</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Create New Post</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <UserTagging
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="What's the title of your post? (Type @ to tag someone)"
            />
          </div>

          <div>
            <UserTagging
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe what you need or want to offer... (Type @ to tag someone)"
              multiline
              rows={3}
            />
          </div>

          <div>
            <Input
              placeholder="Location (optional)"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          {/* Show tagged users */}
          {taggedUsers.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">Tagged users:</div>
              <div className="flex flex-wrap gap-2">
                {taggedUsers.map((user, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    @{user.username}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Media Upload Section */}
          <MediaUpload
            onMediaChange={handleMediaChange}
            maxFiles={5}
            maxFileSize={10}
          />

          {/* Post Options - Always Visible */}
          <PostOptions
            formData={formData}
            onFormDataChange={handleInputChange}
          />

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsExpanded(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {formData.scheduledFor ? "Schedule Post" : "Share Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
