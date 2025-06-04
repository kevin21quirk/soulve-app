
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Paperclip, Image, X } from "lucide-react";
import { useFileUpload } from "@/hooks/messaging/useFileUpload";
import { useTypingIndicator } from "@/hooks/messaging/useTypingIndicator";
import { useAuth } from "@/contexts/AuthContext";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: (content: string, attachment?: any) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  sending: boolean;
  disabled?: boolean;
  partnerId?: string;
}

const MessageInput = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyPress,
  sending,
  disabled = false,
  partnerId
}: MessageInputProps) => {
  const { user } = useAuth();
  const { uploadFile, uploading } = useFileUpload(user?.id);
  const { startTyping, stopTyping } = useTypingIndicator(user?.id, partnerId || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || sending || (!newMessage.trim() && !selectedFile)) return;

    let attachment = null;
    
    if (selectedFile) {
      attachment = await uploadFile(selectedFile);
      if (!attachment) return; // Upload failed
    }

    const messageContent = newMessage.trim() || (selectedFile ? selectedFile.name : '');
    onSendMessage(messageContent, attachment);
    setNewMessage('');
    clearFile();
    stopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    onKeyPress?.(e);
  };

  return (
    <div className="border-t p-4">
      {/* File preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <Paperclip className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-1 flex space-x-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder={disabled ? "Unable to send messages" : "Type a message..."}
            className="flex-1"
            disabled={disabled || sending || uploading}
            onKeyPress={handleKeyPress}
          />
          
          {/* File upload button */}
          <div className="relative">
            <input
              type="file"
              accept="image/*,*/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={disabled || sending || uploading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={disabled || sending || uploading}
              className="px-3"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          size="sm" 
          disabled={(!newMessage.trim() && !selectedFile) || sending || disabled || uploading}
          className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:from-[#0bd19c] hover:to-[#1690e8] text-white"
        >
          {sending || uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
