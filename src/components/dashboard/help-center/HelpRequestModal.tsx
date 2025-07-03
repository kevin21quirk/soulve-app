
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, AlertCircle, X } from "lucide-react";
import { useCreatePost } from "@/hooks/useCreatePost";

interface HelpRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpRequestModal = ({ isOpen, onClose }: HelpRequestModalProps) => {
  const { createPost, isSubmitting } = useCreatePost();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "help_needed",
    urgency: "medium",
    location: "",
    tags: [] as string[],
    contactPreference: "platform"
  });
  const [newTag, setNewTag] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPost({
        title: formData.title,
        content: formData.description,
        category: formData.category,
        urgency: formData.urgency as 'low' | 'medium' | 'high' | 'urgent',
        location: formData.location,
        tags: formData.tags,
        visibility: "public"
      });
      
      // Reset form and close modal
      setFormData({
        title: "",
        description: "",
        category: "help_needed",
        urgency: "medium",
        location: "",
        tags: [],
        contactPreference: "platform"
      });
      onClose();
    } catch (error) {
      console.error('Failed to create help request:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Create Help Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Briefly describe what you need help with"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide more details about your request, what kind of help you need, and any specific requirements"
              rows={4}
              required
            />
          </div>

          {/* Category and Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="help_needed">Help Needed</SelectItem>
                  <SelectItem value="volunteer">Volunteer Opportunity</SelectItem>
                  <SelectItem value="announcement">Community Announcement</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>Low - No rush</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span>Medium - Within a week</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>High - Within 2-3 days</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>Urgent - ASAP</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, area, or 'Remote' if location doesn't matter"
                className="pl-10"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add relevant tags (e.g., moving, elderly-care, tech-help)"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                Add
              </Button>
            </div>
          </div>

          {/* Contact Preference */}
          <div className="space-y-2">
            <Label>How should people contact you?</Label>
            <Select value={formData.contactPreference} onValueChange={(value) => setFormData(prev => ({ ...prev, contactPreference: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">Through SouLVE platform</SelectItem>
                <SelectItem value="direct">Direct contact (will be shown in post)</SelectItem>
                <SelectItem value="both">Both platform and direct contact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
            >
              {isSubmitting ? "Creating..." : "Create Help Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HelpRequestModal;
