import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  Heart, 
  Star, 
  Sparkles,
  Target,
  MapPin,
  Loader2
} from 'lucide-react';
import { useReliveStories } from '@/hooks/useReliveStories';
import { useToast } from '@/hooks/use-toast';

interface PostStoryUpdaterProps {
  postId: string;
  postTitle: string;
  onUpdateAdded: () => void;
}

const PostStoryUpdater = ({ postId, postTitle, onUpdateAdded }: PostStoryUpdaterProps) => {
  const { createStoryUpdate } = useReliveStories();
  const { toast } = useToast();
  const [updateType, setUpdateType] = useState<'progress' | 'completion' | 'impact' | 'reflection'>('progress');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [stats, setStats] = useState({
    helpedCount: '',
    hoursContributed: '',
    impactReach: ''
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const emotionOptions = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '🙏', label: 'Grateful' },
    { emoji: '💪', label: 'Empowered' },
    { emoji: '❤️', label: 'Loved' },
    { emoji: '🎉', label: 'Celebrating' },
    { emoji: '😌', label: 'Peaceful' },
    { emoji: '🌟', label: 'Inspired' },
    { emoji: '🤝', label: 'Connected' },
  ];

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEmotion = (emotion: string) => {
    setEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const detectLocation = async () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      setLocationLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const locationString = [
              data.locality || data.city,
              data.principalSubdivision || data.countryName
            ].filter(Boolean).join(', ');
            
            setLocation(locationString || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            
            toast({
              title: "Location detected",
              description: `Current location: ${locationString}`,
            });
          } else {
            // Fallback to coordinates if geocoding fails
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            toast({
              title: "Location detected",
              description: "Location coordinates captured.",
            });
          }
        } catch (error) {
          // Fallback to coordinates if geocoding service fails
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast({
            title: "Location detected",
            description: "Location coordinates captured.",
          });
        }
        
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        let errorMessage = "Unable to detect location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location detection failed",
          description: errorMessage,
          variant: "destructive"
        });
      },
      options
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Upload media file to storage if present
      const mediaUrl = mediaFile ? '' : undefined; // Will implement media upload later
      const mediaType = mediaFile?.type.startsWith('video/') ? 'video' : 'image';

      const statsData = {
        helpedCount: stats.helpedCount ? parseInt(stats.helpedCount) : undefined,
        hoursContributed: stats.hoursContributed ? parseInt(stats.hoursContributed) : undefined,
        impactReach: stats.impactReach ? parseInt(stats.impactReach) : undefined,
        location: location || undefined
      };

      await createStoryUpdate(postId, {
        update_type: updateType,
        title,
        content,
        media_url: mediaUrl,
        media_type: mediaUrl ? mediaType : undefined,
        emotions,
        stats: statsData
      });

      // Reset form
      setTitle('');
      setContent('');
      setLocation('');
      setMediaFile(null);
      setMediaPreview('');
      setEmotions([]);
      setStats({ helpedCount: '', hoursContributed: '', impactReach: '' });
      
      onUpdateAdded();
    } catch (error) {
      console.error('Error creating story update:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpdateTypeInfo = (type: string) => {
    const info = {
      progress: {
        icon: Target,
        title: 'Progress Update',
        description: 'Share how things are going',
        color: 'text-blue-500'
      },
      completion: {
        icon: Star,
        title: 'Completion',
        description: 'Celebrate the achievement',
        color: 'text-green-500'
      },
      impact: {
        icon: Sparkles,
        title: 'Impact Story',
        description: 'Show the difference made',
        color: 'text-purple-500'
      },
      reflection: {
        icon: Heart,
        title: 'Reflection',
        description: 'Share thoughts and feelings',
        color: 'text-pink-500'
      }
    };
    return info[type as keyof typeof info];
  };

  const typeInfo = getUpdateTypeInfo(updateType);
  const IconComponent = typeInfo.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-blue-500" />
          <span>Add Story Update</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Help others relive this moment by sharing the journey of "{postTitle}"
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Update Type */}
        <div className="space-y-2">
          <Label>Update Type</Label>
          <Select value={updateType} onValueChange={(value: any) => setUpdateType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['progress', 'completion', 'impact', 'reflection'].map(type => {
                const info = getUpdateTypeInfo(type);
                const Icon = info.icon;
                return (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${info.color}`} />
                      <div>
                        <div className="font-medium">{info.title}</div>
                        <div className="text-xs text-gray-500">{info.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Update Title</Label>
          <Input
            id="title"
            placeholder="Give your update a meaningful title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Story Content</Label>
          <Textarea
            id="content"
            placeholder="Share the story, progress, or impact. This will be part of the relive experience..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location (optional)</Label>
          <div className="flex space-x-2">
            <Input
              id="location"
              placeholder="Add location to your update..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={detectLocation}
              disabled={locationLoading}
              className="flex items-center space-x-2"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {locationLoading ? 'Detecting...' : 'Detect'}
              </span>
            </Button>
          </div>
        </div>

        {/* Media Upload - Simplified for now */}
        <div className="space-y-2">
          <Label>Media (optional)</Label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
            {mediaPreview ? (
              <div className="relative">
                {mediaFile?.type.startsWith('video/') ? (
                  <video src={mediaPreview} controls className="w-full max-h-64 rounded-lg" />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview('');
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <Button variant="outline" onClick={() => document.getElementById('media-upload')?.click()}>
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photo/Video
                  </Button>
                  <p className="text-xs text-gray-500">
                    Add photos or videos to make the story come alive
                  </p>
                </div>
              </div>
            )}
            <input
              id="media-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Emotions */}
        <div className="space-y-2">
          <Label>How are you feeling? (optional)</Label>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map((emotion) => (
              <Button
                key={emotion.label}
                variant={emotions.includes(emotion.label) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleEmotion(emotion.label)}
                className="text-sm"
              >
                <span className="mr-1">{emotion.emoji}</span>
                {emotion.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Impact Stats (for completion/impact updates) */}
        {(updateType === 'completion' || updateType === 'impact') && (
          <div className="space-y-4">
            <Label>Impact Numbers (optional)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="helped" className="text-xs">People Helped</Label>
                <Input
                  id="helped"
                  type="number"
                  placeholder="0"
                  value={stats.helpedCount}
                  onChange={(e) => setStats(prev => ({ ...prev, helpedCount: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hours" className="text-xs">Hours Contributed</Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="0"
                  value={stats.hoursContributed}
                  onChange={(e) => setStats(prev => ({ ...prev, hoursContributed: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="reach" className="text-xs">Community Reach</Label>
                <Input
                  id="reach"
                  type="number"
                  placeholder="0"
                  value={stats.impactReach}
                  onChange={(e) => setStats(prev => ({ ...prev, impactReach: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Selected emotions display */}
        {emotions.length > 0 && (
          <div className="space-y-2">
            <Label>Selected feelings:</Label>
            <div className="flex flex-wrap gap-1">
              {emotions.map((emotion) => {
                const emotionData = emotionOptions.find(e => e.label === emotion);
                return (
                  <Badge key={emotion} variant="secondary" className="text-sm">
                    {emotionData?.emoji} {emotion}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Current location display */}
        {location && (
          <div className="space-y-2">
            <Label>Location:</Label>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('')}
                className="ml-auto h-6 w-6 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        {/* Submit */}
        <Button 
          onClick={handleSubmit} 
          disabled={loading || !title.trim() || !content.trim()}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding Story Update...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <IconComponent className="h-4 w-4" />
              <span>Add Story Update</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostStoryUpdater;
