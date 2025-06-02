
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  MapPin, 
  Smile, 
  Users, 
  Calendar,
  Settings,
  Send,
  X,
  ChevronDown
} from 'lucide-react';
import { FEELINGS, POST_CATEGORIES, URGENCY_LEVELS } from '../post-options/PostOptionsConfig';
import { PostFormData } from '../CreatePostTypes';
import { useAuth } from '@/contexts/AuthContext';

interface SocialPostComposerProps {
  onSubmit: (data: PostFormData) => void;
  onCancel: () => void;
  isExpanded: boolean;
}

const SocialPostComposer = ({ onSubmit, onCancel, isExpanded }: SocialPostComposerProps) => {
  const { user } = useAuth();
  const [showFeelings, setShowFeelings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.category) return;
    
    // Auto-generate title from description if not provided
    const finalData = {
      ...formData,
      title: formData.title || formData.description.split('\n')[0].substring(0, 50) + '...'
    };
    
    onSubmit(finalData);
  };

  const selectedFeeling = FEELINGS.find(f => f.value === formData.feeling);
  const selectedCategory = POST_CATEGORIES.find(c => c.value === formData.category);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with user info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              {user?.user_metadata?.first_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-sm">
              {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {/* Feeling selector - prominent like Facebook */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeelings(!showFeelings)}
                className="h-7 px-2 text-xs"
              >
                {selectedFeeling ? (
                  <>
                    <span className="mr-1">{selectedFeeling.emoji}</span>
                    <span>feeling {selectedFeeling.label}</span>
                  </>
                ) : (
                  <>
                    <Smile className="h-3 w-3 mr-1" />
                    <span>Add feeling</span>
                  </>
                )}
              </Button>
              
              {/* Category selector */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCategories(!showCategories)}
                className="h-7 px-2 text-xs"
              >
                {selectedCategory ? (
                  <>
                    <selectedCategory.icon className="h-3 w-3 mr-1" />
                    <span>{selectedCategory.label}</span>
                  </>
                ) : (
                  <>
                    <Users className="h-3 w-3 mr-1" />
                    <span>Category</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Feelings dropdown */}
        {showFeelings && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-2">How are you feeling?</div>
            <div className="flex flex-wrap gap-1">
              {FEELINGS.map((feeling) => (
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
                  <span>{feeling.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Categories dropdown */}
        {showCategories && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-2">What kind of post is this?</div>
            <div className="grid grid-cols-2 gap-2">
              {POST_CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={formData.category === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: category.value }));
                    setShowCategories(false);
                  }}
                  className="h-10 px-3 text-xs justify-start"
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">{category.label}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          {/* Title input - less prominent */}
          <Input
            placeholder="Add a title (optional)"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mb-3 border-0 shadow-none text-sm placeholder-gray-400 focus-visible:ring-0"
          />

          {/* Main text area */}
          <Textarea
            placeholder={`What's on your mind, ${user?.user_metadata?.first_name}?`}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="border-0 shadow-none resize-none focus-visible:ring-0 text-base placeholder-gray-500 min-h-[80px]"
            rows={3}
          />

          {/* Location input */}
          {formData.location && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{formData.location}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, location: '' }))}
                className="h-auto p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Selected options display */}
          <div className="flex flex-wrap gap-2 mt-3">
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
            {formData.urgency !== 'low' && (
              <Badge variant="destructive" className="text-xs">
                {formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1)} Priority
              </Badge>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                <Camera className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:bg-red-50"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => setFormData(prev => ({ ...prev, location: 'Current Location' })),
                      () => setFormData(prev => ({ ...prev, location: 'Location unavailable' }))
                    );
                  }
                }}
              >
                <MapPin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                <Calendar className="h-4 w-4" />
              </Button>
              
              {/* Urgency selector */}
              <select
                value={formData.urgency}
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
                className="text-xs border-0 bg-transparent text-gray-600 focus:outline-none"
              >
                {URGENCY_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <Button 
              type="submit"
              disabled={!formData.description.trim() || !formData.category}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-6 py-2 text-sm font-medium disabled:opacity-50 hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90"
            >
              <Send className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SocialPostComposer;
