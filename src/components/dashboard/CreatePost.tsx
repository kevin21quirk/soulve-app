
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: ""
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
      timestamp: "Just now",
      location: formData.location || "Your area",
      responses: 0,
      likes: 0,
      isLiked: false
    };

    onPostCreated(newPost);
    setFormData({ title: "", description: "", category: "", location: "" });
    setIsExpanded(false);
    
    toast({
      title: "Post created!",
      description: "Your post has been shared with the community.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            <X className="h-4 w-4" />
          </Button>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="help-needed">Help Needed</SelectItem>
                <SelectItem value="help-offered">Help Offered</SelectItem>
                <SelectItem value="success-story">Success Story</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Location (optional)"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsExpanded(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Share Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
