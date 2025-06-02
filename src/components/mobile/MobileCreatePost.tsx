
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Smile, X, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FEELINGS, POST_CATEGORIES } from "@/components/dashboard/post-options/PostOptionsConfig";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";

interface MobileCreatePostProps {
  onPostCreated: (post: any) => void;
}

const MobileCreatePost = ({ onPostCreated }: MobileCreatePostProps) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFeelings, setShowFeelings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    urgency: 'low',
    feeling: '',
    tags: [],
    visibility: 'public',
    allowComments: true,
    allowSharing: true,
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 4));
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setFormData(prev => ({ ...prev, location: 'Current Location' })),
        () => setFormData(prev => ({ ...prev, location: 'Location unavailable' }))
      );
    }
  };

  const handlePost = () => {
    if (!formData.description.trim() || !formData.category) return;

    const postData = {
      ...formData,
      title: formData.title || formData.description.split('\n')[0] || formData.description.substring(0, 50)
    };

    onPostCreated(postData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      urgency: 'low',
      feeling: '',
      tags: [],
      visibility: 'public',
      allowComments: true,
      allowSharing: true,
    });
    setSelectedImages([]);
    setIsExpanded(false);
  };

  const selectedFeeling = FEELINGS.find(f => f.value === formData.feeling);
  const selectedCategory = POST_CATEGORIES.find(c => c.value === formData.category);

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {/* Quick Action Prompt */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              {user?.user_metadata?.first_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-left text-gray-500 text-sm hover:bg-gray-100 transition-colors"
          >
            What's on your mind, {user?.user_metadata?.first_name}?
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="flex items-center space-x-1 text-green-600 hover:bg-green-50"
            >
              <Camera className="h-4 w-4" />
              <span className="text-xs">Photo</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="flex items-center space-x-1 text-yellow-600 hover:bg-yellow-50"
            >
              <Smile className="h-4 w-4" />
              <span className="text-xs">Feeling</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              {user?.user_metadata?.first_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium text-sm">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        {/* Feelings and Category Row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFeelings(!showFeelings)}
            className="h-8"
          >
            {selectedFeeling ? (
              <>
                <span className="mr-1">{selectedFeeling.emoji}</span>
                <span className="text-xs">feeling {selectedFeeling.label}</span>
              </>
            ) : (
              <>
                <Smile className="h-3 w-3 mr-1" />
                <span className="text-xs">Add feeling</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCategories(!showCategories)}
            className="h-8"
          >
            {selectedCategory ? (
              <>
                <selectedCategory.icon className="h-3 w-3 mr-1" />
                <span className="text-xs">{selectedCategory.label}</span>
              </>
            ) : (
              <span className="text-xs">Category</span>
            )}
          </Button>
        </div>

        {/* Feelings selector */}
        {showFeelings && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-2">How are you feeling?</div>
            <div className="flex flex-wrap gap-1">
              {FEELINGS.slice(0, 6).map((feeling) => (
                <Button
                  key={feeling.value}
                  variant={formData.feeling === feeling.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, feeling: feeling.value }));
                    setShowFeelings(false);
                  }}
                  className="h-8 px-2 text-xs"
                >
                  <span className="mr-1">{feeling.emoji}</span>
                  {feeling.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Categories selector */}
        {showCategories && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-2">What kind of post?</div>
            <div className="grid grid-cols-1 gap-2">
              {POST_CATEGORIES.slice(0, 4).map((category) => (
                <Button
                  key={category.value}
                  variant={formData.category === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: category.value }));
                    setShowCategories(false);
                  }}
                  className="h-10 justify-start"
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  <span className="text-xs">{category.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Text Area */}
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder={`What's on your mind, ${user?.user_metadata?.first_name}?`}
          className="w-full border-0 resize-none focus:ring-0 focus:outline-none text-sm min-h-[80px] placeholder-gray-400 bg-transparent"
          rows={3}
        />

        {/* Selected options display */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedFeeling && (
            <Badge variant="secondary" className="text-xs">
              {selectedFeeling.emoji} {selectedFeeling.label}
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="outline" className="text-xs">
              <selectedCategory.icon className="h-3 w-3 mr-1" />
              {selectedCategory.label}
            </Badge>
          )}
        </div>

        {/* Location Display */}
        {formData.location && (
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{formData.location}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFormData(prev => ({ ...prev, location: '' }))}
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
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between border-t border-gray-100 p-3">
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
          >
            <MapPin className="h-4 w-4 text-red-500" />
          </Button>
        </div>
        
        <Button 
          size="sm"
          onClick={handlePost}
          disabled={!formData.description.trim() || !formData.category}
          className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          <Send className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default MobileCreatePost;
