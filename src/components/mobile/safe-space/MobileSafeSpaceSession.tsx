
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Shield, Clock, Star, X, ArrowLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSafeSpaceSession } from "@/hooks/useSafeSpaceSession";

interface MobileSafeSpaceSessionProps {
  session: {
    id: string;
    session_token: string;
    issue_category: string;
    urgency_level: string;
    status: string;
    started_at: string;
    helper_id?: string;
  };
  onBack: () => void;
}

const MobileSafeSpaceSession = ({ session, onBack }: MobileSafeSpaceSessionProps) => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showRating, setShowRating] = useState(false);
  
  const {
    messages,
    sendMessage,
    endSession,
    isConnected
  } = useSafeSpaceSession(session.id);

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(session.started_at);
      const now = new Date();
      const duration = Math.floor((now.getTime() - start.getTime()) / 1000);
      setSessionDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [session.started_at]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await sendMessage(messageText);
      setMessageText("");
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEndSession = async (rating?: number) => {
    try {
      await endSession(rating);
      toast({
        title: "Session ended",
        description: "Thank you for using Safe Space.",
      });
      onBack();
    } catch (error) {
      toast({
        title: "Failed to end session",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-50 border-b border-green-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-medium">Safe Space</span>
            <Badge variant="outline" className="bg-white text-xs">
              {isConnected ? "Connected" : "Connecting..."}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(sessionDuration)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRating(true)}
              className="text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-green-800">
          <Badge variant="outline" className="bg-white">
            {session.issue_category.replace('_', ' ')}
          </Badge>
          <span>Anonymous & Encrypted</span>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 border-b border-red-200 p-3">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-800">
            <span className="font-medium">Crisis Support:</span> If you're in immediate danger, 
            contact emergency services (999) immediately.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Anonymous conversation started</p>
            <p className="text-xs">Feel free to share what's on your mind</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender_role === 'requester' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender_role === 'requester'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            maxLength={500}
          />
          <Button
            type="submit"
            disabled={!messageText.trim() || !isConnected}
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="font-medium mb-4">Rate this session</h3>
            <p className="text-sm text-gray-600 mb-4">
              How was your experience? This helps us improve our service.
            </p>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="outline"
                  onClick={() => handleEndSession(rating)}
                  className="p-2"
                >
                  <Star className="h-4 w-4" />
                  <span className="ml-1">{rating}</span>
                </Button>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowRating(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleEndSession()}
                className="flex-1"
              >
                End Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSafeSpaceSession;
