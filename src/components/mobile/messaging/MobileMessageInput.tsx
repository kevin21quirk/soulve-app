import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Mic, MicOff, Image as ImageIcon, Camera, X, Plus } from "lucide-react";

interface MobileMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

const MobileMessageInput = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isRecording,
  onToggleRecording,
}: MobileMessageInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: "file" | "image") => {
    if (type === "file") {
      fileInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
    setShowAttachments(false);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (value.trim() || attachments.length > 0) {
      onSend();
      setAttachments([]);
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center space-x-2"
            >
              <span className="text-sm text-blue-700 truncate max-w-24">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(index)}
                className="h-5 w-5 p-0 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Attachment options */}
      {showAttachments && (
        <div className="mb-3 bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 h-auto py-3"
              onClick={() => handleFileSelect("image")}
            >
              <ImageIcon className="h-6 w-6 text-blue-600" />
              <span className="text-xs text-gray-600">Photo</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 h-auto py-3"
              onClick={() => handleFileSelect("file")}
            >
              <Paperclip className="h-6 w-6 text-blue-600" />
              <span className="text-xs text-gray-600">File</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center space-y-1 h-auto py-3">
              <Camera className="h-6 w-6 text-blue-600" />
              <span className="text-xs text-gray-600">Camera</span>
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end space-x-2">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAttachments(!showAttachments)}
          className={`p-2 ${showAttachments ? "bg-gray-100" : ""}`}
        >
          <Plus className={`h-5 w-5 transition-transform ${showAttachments ? "rotate-45" : ""}`} />
        </Button>

        {/* Message input */}
        <div className="flex-1">
          {isExpanded ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your message... mobile"
              className="min-h-[80px] resize-none rounded-2xl border-gray-300 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsExpanded(false);
                }
                onKeyPress(e);
              }}
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your message..."
              className="rounded-2xl border-gray-300 focus:border-blue-500 pr-12"
              onFocus={() => setIsExpanded(true)}
              onKeyPress={onKeyPress}
            />
          )}
        </div>

        {/* Voice/Send button */}
        {value.trim() || attachments.length > 0 ? (
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="rounded-full h-10 w-10 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:from-[#0bd19c] hover:to-[#1690e8] p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRecording}
            className={`rounded-full h-10 w-10 p-0 ${isRecording ? "bg-red-100 text-red-600" : "text-gray-600"}`}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center justify-center space-x-2 text-red-600">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-sm">Recording...</span>
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileInput} />
      <input ref={imageInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handleFileInput} />
    </div>
  );
};

export default MobileMessageInput;
