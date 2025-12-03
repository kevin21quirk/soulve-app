import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Image,
  Smile,
  MapPin,
  BarChart3,
  Calendar,
  Hash,
  AtSign,
  X,
  ChevronDown,
  Globe,
  Users,
  Lock,
  Sparkles,
  Send,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PostFormData, MediaFile } from '@/components/dashboard/CreatePostTypes';
import { POST_CATEGORIES } from '@/components/dashboard/post-options/PostOptionsConfig';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from '@/components/dashboard/gif-picker/GifPicker';
import PollCreator from '@/components/dashboard/polls/PollCreator';
import EventCreator from '@/components/dashboard/events/EventCreator';
import EnhancedMediaUpload from '@/components/dashboard/post-creation/EnhancedMediaUpload';

const MAX_CHARS = 2000;
const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see' },
  { value: 'friends', label: 'Friends', icon: Users, description: 'Only connections' },
  { value: 'private', label: 'Only me', icon: Lock, description: 'Private' },
];

interface ModernPostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const ModernPostComposer = ({ isOpen, onClose, onSubmit, isSubmitting }: ModernPostComposerProps) => {
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    urgency: 'medium',
    feeling: '',
    tags: [],
    visibility: 'public',
    allowComments: true,
    allowSharing: true,
    selectedMedia: [],
    taggedUsers: [],
    taggedUserIds: [],
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const charCount = formData.description.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;
  const isOverLimit = charCount > MAX_CHARS;

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleEmojiSelect = (emoji: any) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.description;
    const newText = text.substring(0, start) + emoji.emoji + text.substring(end);
    
    setFormData(prev => ({ ...prev, description: newText }));
    setShowEmojiPicker(false);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.emoji.length;
      textarea.focus();
    }, 0);
  };

  const handleGifSelect = (gif: any) => {
    setFormData(prev => ({
      ...prev,
      hasGif: true,
      selectedGif: gif
    }));
    setShowGifPicker(false);
  };

  const handleMediaChange = (files: MediaFile[]) => {
    setFormData(prev => ({ ...prev, selectedMedia: files }));
    if (files.length === 0) {
      setShowMediaUpload(false);
    }
  };

  const handlePollCreate = (pollData: any) => {
    setFormData(prev => ({
      ...prev,
      hasPoll: true,
      pollData
    }));
    setShowPollCreator(false);
  };

  const handleEventCreate = (eventData: any) => {
    setFormData(prev => ({
      ...prev,
      isEvent: true,
      eventData
    }));
    setShowEventCreator(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const location = data.address?.city || data.address?.town || data.address?.village || 
                           data.display_name?.split(',')[0] || 'Your Location';
            setFormData(prev => ({ 
              ...prev, 
              location,
              latitude,
              longitude
            }));
          } catch {
            setFormData(prev => ({ 
              ...prev, 
              location: 'Current Location',
              latitude,
              longitude
            }));
          }
        },
        () => setFormData(prev => ({ ...prev, location: '', latitude: undefined, longitude: undefined }))
      );
    }
  };

  const handleSubmit = async () => {
    if (!formData.description.trim() || !formData.category || isOverLimit) return;
    
    const submitData: PostFormData = {
      ...formData,
      title: formData.title || formData.description.substring(0, 50)
    };

    await onSubmit(submitData);
    
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      urgency: 'medium',
      feeling: '',
      tags: [],
      visibility: 'public',
      allowComments: true,
      allowSharing: true,
      selectedMedia: [],
      taggedUsers: [],
      taggedUserIds: [],
    });
    onClose();
  };

  const removeAttachment = (type: 'gif' | 'poll' | 'event' | 'media') => {
    if (type === 'gif') {
      setFormData(prev => ({ ...prev, hasGif: false, selectedGif: undefined }));
    } else if (type === 'poll') {
      setFormData(prev => ({ ...prev, hasPoll: false, pollData: undefined }));
    } else if (type === 'event') {
      setFormData(prev => ({ ...prev, isEvent: false, eventData: undefined }));
    } else if (type === 'media') {
      setFormData(prev => ({ ...prev, selectedMedia: [] }));
      setShowMediaUpload(false);
    }
  };

  const isFormValid = formData.description.trim() && formData.category && !isOverLimit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Post
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* User Info & Visibility */}
          <div className="px-6 py-4 flex items-center gap-3 border-b bg-accent/20">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold">
                {user?.user_metadata?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {user?.user_metadata?.display_name || 'Anonymous'}
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                    {(() => {
                      const option = VISIBILITY_OPTIONS.find(v => v.value === formData.visibility);
                      const Icon = option?.icon || Globe;
                      return (
                        <span className="flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {option?.label || 'Public'}
                        </span>
                      );
                    })()}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1">
                  {VISIBILITY_OPTIONS.map(option => (
                    <Button
                      key={option.value}
                      variant="ghost"
                      className="w-full justify-start gap-2 h-9"
                      onClick={() => setFormData(prev => ({ ...prev, visibility: option.value as any }))}
                    >
                      <option.icon className="h-4 w-4" />
                      <div className="text-left">
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="px-6 py-4 space-y-4">
            {/* Textarea */}
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="What's happening in your community?"
                value={formData.description}
                onChange={handleDescriptionChange}
                className="min-h-[150px] text-lg border-0 resize-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60"
              />
              
              {/* Character Counter */}
              <div className="absolute bottom-0 right-0 flex items-center gap-2">
                {charCount > MAX_CHARS * 0.8 && (
                  <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {charCount}/{MAX_CHARS}
                  </span>
                )}
                {charCount > MAX_CHARS * 0.8 && (
                  <div className="w-8 h-8 relative">
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted/20"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={88}
                        strokeDashoffset={88 - (88 * Math.min(charPercentage, 100)) / 100}
                        className={isOverLimit ? 'text-destructive' : 'text-primary'}
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Category Selector */}
            <div className="flex flex-wrap gap-2">
              {POST_CATEGORIES.slice(0, 6).map(category => (
                <Button
                  key={category.value}
                  variant={formData.category === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                  className="gap-1"
                >
                  <span>{category.icon}</span>
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Location Display */}
            {formData.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {formData.location}
                <button onClick={() => setFormData(prev => ({ ...prev, location: '' }))}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Attachments Preview */}
            {(formData.selectedMedia?.length > 0 || formData.hasGif || formData.hasPoll || formData.isEvent) && (
              <div className="space-y-3 p-3 bg-accent/30 rounded-lg">
                {/* Media Preview */}
                {formData.selectedMedia && formData.selectedMedia.length > 0 && (
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-2">
                      {formData.selectedMedia.map((media) => (
                        <div key={media.id} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          {media.type === 'image' ? (
                            <img src={media.preview} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <video src={media.preview} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeAttachment('media')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* GIF Preview */}
                {formData.hasGif && formData.selectedGif && (
                  <div className="relative">
                    <img
                      src={formData.selectedGif.url}
                      alt={formData.selectedGif.title}
                      className="w-full max-h-60 object-contain rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeAttachment('gif')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Poll Preview */}
                {formData.hasPoll && formData.pollData && (
                  <div className="relative p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="font-medium">Poll: {formData.pollData.question}</span>
                    </div>
                    <div className="space-y-1">
                      {formData.pollData.options.map((opt: any, idx: number) => (
                        <div key={idx} className="text-sm text-muted-foreground">
                          • {opt.text}
                        </div>
                      ))}
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeAttachment('poll')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Event Preview */}
                {formData.isEvent && formData.eventData && (
                  <div className="relative p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formData.eventData.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{formData.eventData.date} at {formData.eventData.time}</p>
                      <p>{formData.eventData.isVirtual ? 'Virtual Event' : formData.eventData.location}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeAttachment('event')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Media Upload Panel */}
            {showMediaUpload && (
              <EnhancedMediaUpload
                onMediaChange={handleMediaChange}
                maxFiles={4}
                maxFileSize={10}
              />
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 border-t bg-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
                onClick={() => setShowMediaUpload(!showMediaUpload)}
                disabled={formData.hasGif}
              >
                <Image className="h-5 w-5" />
              </Button>
              
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-primary"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-muted-foreground hover:text-primary font-bold"
                disabled={!!formData.selectedMedia?.length}
                onClick={() => setShowGifPicker(true)}
              >
                GIF
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
                onClick={() => setShowPollCreator(true)}
                disabled={formData.isEvent}
              >
                <BarChart3 className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
                onClick={() => setShowEventCreator(true)}
                disabled={formData.hasPoll}
              >
                <Calendar className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
                onClick={handleLocationDetect}
              >
                <MapPin className="h-5 w-5" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-primary"
                  >
                    <Hash className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                    <Button size="sm" onClick={handleAddTag}>Add</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>

        {/* GIF Picker Dialog */}
        {showGifPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center py-8 px-4">
              <GifPicker
                onGifSelect={handleGifSelect}
                onClose={() => setShowGifPicker(false)}
              />
            </div>
          </div>
        )}

        {/* Poll Creator Dialog */}
        {showPollCreator && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center py-8 px-4">
              <PollCreator
                onPollCreate={handlePollCreate}
                onClose={() => setShowPollCreator(false)}
              />
            </div>
          </div>
        )}

        {/* Event Creator Dialog */}
        {showEventCreator && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center py-8 px-4">
              <EventCreator
                onEventCreate={handleEventCreate}
                onClose={() => setShowEventCreator(false)}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModernPostComposer;
