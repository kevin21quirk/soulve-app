
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
    <div className="p-4 border-t">
      {/* File preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-muted rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                  <Paperclip className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* File upload button */}
        <div className="relative">
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx,.mp4,.mov,.avi"
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
            className="h-10 w-10 p-0 rounded-full hover:bg-primary/10 hover:text-primary"
            title="Attach file"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder={disabled ? "Unable to send messages" : "Aa"}
            className="rounded-full bg-muted border-0 pr-12 h-10"
            disabled={disabled || sending || uploading}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        {/* Send button */}
        <Button 
          type="submit" 
          size="sm"
          disabled={(!newMessage.trim() && !selectedFile) || sending || disabled || uploading}
          className="h-10 w-10 p-0 rounded-full bg-primary hover:bg-primary/90"
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
