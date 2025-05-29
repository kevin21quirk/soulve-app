
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Smile, ImageIcon, X, AlertCircle, Heart, Users } from "lucide-react";
import { FeedPost } from "@/types/feed";

interface MobileCreatePostProps {
  onPostCreated: (post: FeedPost) => void;
}

interface QuickTemplate {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
}

const quickTemplates: QuickTemplate[] = [
  {
    id: "help-needed",
    title: "Need Help",
    category: "help-needed",
    icon: <AlertCircle className="h-4 w-4" />,
    color: "bg-red-100 text-red-700 border-red-200",
    placeholder: "What kind of help do you need?"
  },
  {
    id: "help-offered",
    title: "Offer Help",
    category: "help-offered", 
    icon: <Heart className="h-4 w-4" />,
    color: "bg-green-100 text-green-700 border-green-200",
    placeholder: "How can you help others?"
  },
  {
    id: "success-story",
    title: "Success Story",
    category: "success-story",
    icon: <Smile className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    placeholder: "Share your success story!"
  },
  {
    id: "announcement",
    title: "Announcement",
    category: "announcement",
    icon: <Users className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    placeholder: "What would you like to announce?"
  }
];

const MobileCreatePost = ({ onPostCreated }: MobileCreatePostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuickTemplate | null>(null);
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [location, setLocation] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleTemplateSelect = (template: QuickTemplate) => {
    setSelectedTemplate(template);
    setPostText("");
    setIsExpanded(true);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 4)); // Max 4 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode this
          setLocation("Current Location");
          setIsDetectingLocation(false);
        },
        () => {
          setLocation("Location unavailable");
          setIsDetectingLocation(false);
        }
      );
    } else {
      setLocation("Location not supported");
      setIsDetectingLocation(false);
    }
  };

  const handlePost = () => {
    if (!postText.trim() || !selectedTemplate) return;

    const newPost: FeedPost = {
      id: Date.now().toString(),
      author: "You",
      avatar: "",
      title: postText.split('\n')[0] || postText.substring(0, 50),
      description: postText,
      category: selectedTemplate.category as any,
      timestamp: "Just now",
      location: location || "Your area",
      responses: 0,
      likes: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      isShared: false,
      tags: [selectedTemplate.id]
    };

    onPostCreated(newPost);
    
    // Reset form
    setPostText("");
    setSelectedTemplate(null);
    setSelectedImages([]);
    setLocation("");
    setIsExpanded(false);
  };

  const reset = () => {
    setPostText("");
    setSelectedTemplate(null);
    setSelectedImages([]);
    setLocation("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {/* Quick Action Prompt */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt="You" />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              Y
            </AvatarFallback>
          </Avatar>
          
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-left text-gray-500 text-sm hover:bg-gray-100 transition-colors"
          >
            What's on your mind?
          </button>
        </div>
        
        {/* Quick Templates */}
        <div className="grid grid-cols-2 gap-2">
          {quickTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              size="sm"
              onClick={() => handleTemplateSelect(template)}
              className="flex items-center space-x-2 justify-start h-auto py-3 px-3"
            >
              {template.icon}
              <span className="text-xs font-medium">{template.title}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt="You" />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              Y
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">Create Post</div>
            {selectedTemplate && (
              <Badge className={`${selectedTemplate.color} text-xs px-2 py-0.5 border`}>
                {selectedTemplate.title}
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} className="p-1">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Area */}
      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder={selectedTemplate?.placeholder || "What's on your mind?"}
        className="w-full border-0 resize-none focus:ring-0 focus:outline-none text-sm min-h-[80px] placeholder-gray-400"
        rows={3}
      />

      {/* Location Display */}
      {location && (
        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("")}
            className="p-0 h-auto ml-2 text-gray-400"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center space-x-1">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="ghost" size="sm" className="p-2" asChild>
              <span>
                <Camera className="h-4 w-4 text-green-500" />
              </span>
            </Button>
          </label>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={detectLocation}
            disabled={isDetectingLocation}
          >
            <MapPin className={`h-4 w-4 ${isDetectingLocation ? 'text-blue-500' : 'text-red-500'}`} />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Smile className="h-4 w-4 text-yellow-500" />
          </Button>
        </div>
        
        <Button 
          size="sm"
          onClick={handlePost}
          disabled={!postText.trim() || !selectedTemplate}
          className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default MobileCreatePost;
