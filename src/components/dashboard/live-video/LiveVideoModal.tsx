
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Video, X, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveVideoData {
  streamId: string;
  title: string;
  startTime: Date;
  stream?: MediaStream;
}

interface LiveVideoModalProps {
  onStartLive: (data: LiveVideoData) => void;
  onClose: () => void;
}

const LiveVideoModal = ({ onStartLive, onClose }: LiveVideoModalProps) => {
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<'internal' | 'youtube' | 'twitch' | 'custom'>('internal');
  const [customRtmpUrl, setCustomRtmpUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    checkCameraAccess();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkCameraAccess = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
      setHasCamera(hasVideoDevice);
      
      if (hasVideoDevice) {
        await startPreview();
      }
    } catch (error) {
      console.error('Error checking camera access:', error);
      setHasCamera(false);
    }
  };

  const startPreview = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error starting preview:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to start live streaming.",
        variant: "destructive"
      });
    }
  };

  const handleStartLive = async () => {
    if (!streamTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your live stream.",
        variant: "destructive"
      });
      return;
    }

    if (!stream) {
      toast({
        title: "No camera access",
        description: "Camera access is required for live streaming.",
        variant: "destructive"
      });
      return;
    }

    setIsStarting(true);

    try {
      // Simulate stream initialization
      await new Promise(resolve => setTimeout(resolve, 2000));

      const liveData: LiveVideoData = {
        streamId: `live_${Date.now()}`,
        title: streamTitle,
        startTime: new Date(),
        stream: stream
      };

      onStartLive(liveData);
      
      toast({
        title: "Live stream started!",
        description: "Your live stream is now broadcasting.",
      });

    } catch (error) {
      console.error('Error starting live stream:', error);
      toast({
        title: "Failed to start stream",
        description: "There was an error starting your live stream. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStarting(false);
    }
  };

  const platforms = [
    {
      id: 'internal' as const,
      name: 'SouLVE Live',
      description: 'Stream directly on our platform',
      available: true
    },
    {
      id: 'youtube' as const,
      name: 'YouTube Live',
      description: 'Stream to YouTube (requires API key)',
      available: false
    },
    {
      id: 'twitch' as const,
      name: 'Twitch',
      description: 'Stream to Twitch (requires stream key)',
      available: false
    },
    {
      id: 'custom' as const,
      name: 'Custom RTMP',
      description: 'Use your own RTMP endpoint',
      available: true
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-red-500" />
              <span>Start Live Stream</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Camera Preview */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Camera Preview</label>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {hasCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                    <p>No camera detected</p>
                    <p className="text-sm text-gray-400">Please connect a camera to continue</p>
                  </div>
                </div>
              )}
              
              {/* Live indicator */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                PREVIEW
              </div>
            </div>
          </div>

          {/* Stream Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Stream Title *
              </label>
              <Input
                placeholder="Enter your stream title..."
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Description (optional)
              </label>
              <Textarea
                placeholder="Describe what you'll be streaming about..."
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Streaming Platform</label>
            <div className="grid grid-cols-1 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => platform.available && setSelectedPlatform(platform.id)}
                  disabled={!platform.available}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    selectedPlatform === platform.id
                      ? 'border-blue-500 bg-blue-50'
                      : platform.available
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{platform.name}</div>
                      <div className="text-sm text-gray-500">{platform.description}</div>
                    </div>
                    {!platform.available && (
                      <span className="text-xs text-orange-500 font-medium">Coming Soon</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom RTMP URL */}
          {selectedPlatform === 'custom' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                RTMP URL
              </label>
              <Input
                placeholder="rtmp://your-server.com/live/stream-key"
                value={customRtmpUrl}
                onChange={(e) => setCustomRtmpUrl(e.target.value)}
              />
            </div>
          )}

          {/* Integration Notice */}
          {(selectedPlatform === 'youtube' || selectedPlatform === 'twitch') && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    External Platform Integration
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    To stream to {platform.name}, you'll need to configure API keys in your account settings.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Configure Integration
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleStartLive}
              disabled={!hasCamera || isStarting || !streamTitle.trim()}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Go Live
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveVideoModal;
