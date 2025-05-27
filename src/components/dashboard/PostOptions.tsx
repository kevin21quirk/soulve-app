
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Globe, Users, Lock, X } from "lucide-react";
import { format } from "date-fns";
import { FEELINGS, URGENCY_LEVELS, POST_CATEGORIES, PostFormData } from "./CreatePostTypes";

interface PostOptionsProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const PostOptions = ({ formData, onFormDataChange }: PostOptionsProps) => {
  const [newTag, setNewTag] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      onFormDataChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onFormDataChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const getUrgencyConfig = () => 
    URGENCY_LEVELS.find(level => level.value === formData.urgency) || URGENCY_LEVELS[0];

  const getVisibilityIcon = () => {
    switch (formData.visibility) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'friends': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-900">Post Options</h4>
      
      {/* Category and Urgency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Category *</label>
          <Select value={formData.category} onValueChange={(value) => onFormDataChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {POST_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <span className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Urgency Level</label>
          <Select value={formData.urgency} onValueChange={(value) => onFormDataChange('urgency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent>
              {URGENCY_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  <div className="flex items-center space-x-2">
                    <span>{level.icon}</span>
                    <span>{level.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feeling */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">How are you feeling?</label>
        <div className="flex flex-wrap gap-2">
          {FEELINGS.map((feeling) => (
            <Button
              key={feeling.value}
              variant={formData.feeling === feeling.value ? "default" : "outline"}
              size="sm"
              onClick={() => onFormDataChange('feeling', feeling.value)}
              className="flex items-center space-x-1"
            >
              <span>{feeling.emoji}</span>
              <span className="text-xs">{feeling.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
              <span>#{tag}</span>
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            className="flex-1"
          />
          <Button onClick={addTag} size="sm" variant="outline">Add</Button>
        </div>
      </div>

      {/* Visibility and Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Visibility</label>
          <Select value={formData.visibility} onValueChange={(value) => onFormDataChange('visibility', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Public</span>
                </div>
              </SelectItem>
              <SelectItem value="friends">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Friends</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Private</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.allowComments}
            onCheckedChange={(checked) => onFormDataChange('allowComments', checked)}
          />
          <label className="text-sm text-gray-700">Allow Comments</label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.allowSharing}
            onCheckedChange={(checked) => onFormDataChange('allowSharing', checked)}
          />
          <label className="text-sm text-gray-700">Allow Sharing</label>
        </div>
      </div>

      {/* Schedule Post */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Switch
            checked={showSchedule}
            onCheckedChange={setShowSchedule}
          />
          <label className="text-sm font-medium text-gray-700">Schedule for later</label>
        </div>
        
        {showSchedule && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.scheduledFor ? format(formData.scheduledFor, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.scheduledFor}
                onSelect={(date) => onFormDataChange('scheduledFor', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Display selected urgency and feeling */}
      {(formData.urgency !== 'low' || formData.feeling) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {formData.urgency !== 'low' && (
            <Badge className={getUrgencyConfig().color}>
              {getUrgencyConfig().icon} {getUrgencyConfig().label}
            </Badge>
          )}
          {formData.feeling && (
            <Badge variant="outline">
              {FEELINGS.find(f => f.value === formData.feeling)?.emoji} Feeling {FEELINGS.find(f => f.value === formData.feeling)?.label}
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center space-x-1">
            {getVisibilityIcon()}
            <span>{formData.visibility}</span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default PostOptions;
