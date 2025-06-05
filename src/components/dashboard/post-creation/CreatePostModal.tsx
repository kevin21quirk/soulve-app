
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, MapPin, Tag, Users, AlertCircle, Camera, Link, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  sharedPost?: any;
}

const CreatePostModal = ({ isOpen, onClose, onSubmit, isSubmitting, sharedPost }: CreatePostModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    urgency: "medium",
    location: "",
    tags: [] as string[],
    visibility: "public"
  });
  const [currentTag, setCurrentTag] = useState("");

  // Reset form when modal opens/closes or when shared post changes
  useEffect(() => {
    console.log('CreatePostModal - useEffect triggered. isOpen:', isOpen, 'sharedPost:', sharedPost);
    
    if (isOpen) {
      if (sharedPost) {
        console.log('CreatePostModal - Setting up form for shared post:', sharedPost);
        // Pre-fill form for sharing with better formatting
        const shareContent = `Sharing this from ${sharedPost.author}:\n\n"${sharedPost.description || sharedPost.title}"`;
        
        setFormData({
          title: `Re: ${sharedPost.title || sharedPost.description?.substring(0, 50) + '...'}`,
          content: shareContent,
          category: "announcement",
          urgency: "medium",
          location: sharedPost.location || "",
          tags: ["shared-content", ...(sharedPost.tags || [])],
          visibility: "public"
        });
        
        console.log('CreatePostModal - Form data set for shared post');
      } else {
        console.log('CreatePostModal - Resetting form for new post');
        // Reset form for new post
        setFormData({
          title: "",
          content: "",
          category: "",
          urgency: "medium",
          location: "",
          tags: [],
          visibility: "public"
        });
      }
    }
  }, [isOpen, sharedPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('CreatePostModal - Form submitted with data:', formData);
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      console.warn('CreatePostModal - Form validation failed');
      return;
    }

    const submitData = {
      ...formData,
      sharedPostId: sharedPost?.id || null,
      isSharedPost: !!sharedPost
    };

    console.log('CreatePostModal - Submitting data:', submitData);
    onSubmit(submitData);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  console.log('CreatePostModal - Rendering. isOpen:', isOpen, 'hasSharedPost:', !!sharedPost);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {sharedPost ? `Share ${sharedPost.author}'s Post` : "Create New Post"}
          </DialogTitle>
        </DialogHeader>

        {sharedPost && (
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={sharedPost.avatar} />
                <AvatarFallback>
                  {sharedPost.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{sharedPost.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {sharedPost.category.replace('-', ' ')}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{sharedPost.title}</h3>
                <p className="text-gray-700 text-sm">{sharedPost.description}</p>
                {sharedPost.location && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{sharedPost.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 pb-4 border-b">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                {user?.user_metadata?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                {user?.user_metadata?.display_name || user?.email}
              </p>
              <p className="text-sm text-gray-500">Posting to Community</p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <Input
              placeholder={sharedPost ? "Add your thoughts about this post..." : "Give your post a title..."}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Content *</label>
            <Textarea
              placeholder={sharedPost ? "Share why this resonated with you..." : "What's on your mind?"}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              required
            />
          </div>

          {/* Category and Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="help-needed">Help Needed</SelectItem>
                  <SelectItem value="help-offered">Help Offered</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="success-story">Success Story</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Urgency</label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Add a location..."
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Add tags..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="pl-10"
                />
              </div>
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>#{tag}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Visibility</label>
            <Select
              value={formData.visibility}
              onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Public - Anyone can see</span>
                  </div>
                </SelectItem>
                <SelectItem value="community">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Community - Members only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white"
            >
              {isSubmitting ? "Creating..." : sharedPost ? "Share Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
