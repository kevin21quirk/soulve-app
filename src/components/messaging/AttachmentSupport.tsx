
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Paperclip, Image, File, Smile } from 'lucide-react';

interface AttachmentSupportProps {
  onFileSelect: (files: File[]) => void;
  onEmojiSelect: (emoji: string) => void;
}

const AttachmentSupport = ({ onFileSelect, onEmojiSelect }: AttachmentSupportProps) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const commonEmojis = ["😊", "😂", "❤️", "👍", "👎", "😮", "😢", "😡", "🎉", "🔥", "💯", "🙏"];

  const handleFileAttach = (type: 'file' | 'image') => {
    if (type === 'file') {
      fileInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFileSelect(files);
  };

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setShowEmojis(false);
  };

  return (
    <div className="flex space-x-1">
      {/* Attachment menu */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="grid gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFileAttach('image')}
              className="justify-start"
            >
              <Image className="h-4 w-4 mr-2" />
              Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFileAttach('file')}
              className="justify-start"
            >
              <File className="h-4 w-4 mr-2" />
              File
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Emoji picker */}
      <Popover open={showEmojis} onOpenChange={setShowEmojis}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-6 gap-1">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default AttachmentSupport;
