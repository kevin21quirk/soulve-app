
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Shield, Clock, Star, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSafeSpaceSession } from "@/hooks/useSafeSpaceSession";

interface SafeSpaceSessionProps {
  session: {
    id: string;
    session_token: string;
    issue_category: string;
    urgency_level: string;
    status: string;
    started_at: string;
    helper_id?: string;
  };
}

const SafeSpaceSession = ({ session }: SafeSpaceSessionProps) => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const {
    messages,
    sendMessage,
    endSession,
    rateSession,
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
        description: "Thank you for using Safe Space. Take care of yourself.",
      });
    } catch (error) {
      toast({
        title: "Failed to end session",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Session Header */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Safe Space Session</span>
              <Badge variant="outline" className="bg-white">
                {isConnected ? "Connected" : "Connecting..."}
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(sessionDuration)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEndSession()}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                End Session
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-4 text-sm text-green-800">
            <Badge variant="outline" className="bg-white">
              {session.issue_category.replace('_', ' ')}
            </Badge>
            <span className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Anonymous & Encrypted</span>
            </span>
            <span>Messages auto-delete in 24h</span>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Notice */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Crisis Support</p>
              <p>
                If you're experiencing thoughts of self-harm or are in immediate danger, 
                please contact emergency services (999) or a crisis helpline immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="min-h-[400px] max-h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Conversation</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>This is the start of your anonymous conversation.</p>
                <p className="text-sm">Feel free to share what's on your mind.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender_role === 'requester' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender_role === 'requester'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
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
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Need to end this session? Please rate your experience to help us improve.</p>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="outline"
                  size="sm"
                  onClick={() => handleEndSession(rating)}
                  className="p-2"
                >
                  <Star className="h-4 w-4" />
                  <span className="ml-1">{rating}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeSpaceSession;
