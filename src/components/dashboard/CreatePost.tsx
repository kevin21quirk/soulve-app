
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MediaUpload from "./MediaUpload";
import PostOptions from "./PostOptions";
import { MediaFile, PostFormData } from "./CreatePostTypes";

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
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
    setIsExpanded(false);
    setShowOptions(false);
    
    toast({
      title: "Post created!",
      description: "Your post has been shared with the community.",
    });
  };

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaChange = (files: MediaFile[]) => {
    setMediaFiles(files);
  };

  if (!isExpanded) {
    return (
      <Card className="mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsExpanded(true)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 text-gray-500">
            <Plus className="h-5 w-5" />
            <span>Share something with your community...</span>
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
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowOptions(!showOptions)}
              className={showOptions ? "bg-blue-50 text-blue-600" : ""}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="What's the title of your post?"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div>
            <Textarea
              placeholder="Describe what you need or want to offer..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Input
              placeholder="Location (optional)"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          {/* Media Upload Section */}
          <MediaUpload
            onMediaChange={handleMediaChange}
            maxFiles={5}
            maxFileSize={10}
          />

          {/* Advanced Options */}
          {showOptions && (
            <PostOptions
              formData={formData}
              onFormDataChange={handleInputChange}
            />
          )}

          <div className="flex justify-end space-x-2 pt-2">
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
