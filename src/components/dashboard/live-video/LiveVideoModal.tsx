
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, X, Users, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveVideoModalProps {
  onClose: () => void;
  onStartLive: (streamData: any) => void;
}

const LiveVideoModal = ({ onClose, onStartLive }: LiveVideoModalProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera and microphone access to start live video.",
        variant: "destructive"
      });
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startLiveStream = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate connecting to live streaming service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsLive(true);
      setIsConnecting(false);
      
      // Simulate viewer count updates
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 3));
      }, 3000);
      
      const streamData = {
        streamId: `live_${Date.now()}`,
        title: "Live Video Stream",
        startTime: new Date(),
        stream: stream
      };
      
      onStartLive(streamData);
      
      toast({
        title: "You're now live!",
        description: "Your live video stream has started successfully.",
      });
      
      // Clean up interval when component unmounts
      return () => clearInterval(interval);
    } catch (error) {
      setIsConnecting(false);
      toast({
        title: "Failed to start live stream",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };

  const endLiveStream = () => {
    setIsLive(false);
    setViewerCount(0);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-red-500" />
              <span>{isLive ? "Live Video" : "Start Live Video"}</span>
              {isLive && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                  LIVE
                </span>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Video Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {isLive && (
              <div className="absolute top-4 left-4 flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded px-2 py-1">
                  <Users className="h-4 w-4 text-white" />
                  <span className="text-white text-sm">{viewerCount}</span>
                </div>
                <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded px-2 py-1">
                  <MessageCircle className="h-4 w-4 text-white" />
                  <span className="text-white text-sm">Comments</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleVideo}
              disabled={isConnecting}
            >
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
              disabled={isConnecting}
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            
            {!isLive ? (
              <Button
                onClick={startLiveStream}
                disabled={isConnecting || !stream}
                className="bg-red-500 hover:bg-red-600 text-white px-6"
              >
                {isConnecting ? "Connecting..." : "Go Live"}
              </Button>
            ) : (
              <Button
                onClick={endLiveStream}
                variant="destructive"
                className="px-6"
              >
                End Live
              </Button>
            )}
          </div>
          
          {!stream && (
            <div className="text-center text-gray-500">
              <p>Camera and microphone access required</p>
              <Button onClick={initializeCamera} variant="outline" className="mt-2">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveVideoModal;
