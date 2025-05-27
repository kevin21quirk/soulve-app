
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TaggedUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface UserTaggingProps {
  value: string;
  onChange: (value: string, taggedUsers: TaggedUser[]) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

// Mock users for suggestions - in real app this would come from API
const mockUsers: TaggedUser[] = [
  { id: "1", username: "john_helper", displayName: "John Helper", avatar: "" },
  { id: "2", username: "sarah_mentor", displayName: "Sarah Mentor", avatar: "" },
  { id: "3", username: "mike_volunteer", displayName: "Mike Volunteer", avatar: "" },
  { id: "4", username: "lisa_tutor", displayName: "Lisa Tutor", avatar: "" },
  { id: "5", username: "david_organizer", displayName: "David Organizer", avatar: "" },
];

const UserTagging = ({ 
  value, 
  onChange, 
  placeholder = "Type @ to tag someone...", 
  multiline = false,
  rows = 3,
  className = ""
}: UserTaggingProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<TaggedUser[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const detectMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const matches = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      matches.push({
        username: match[1],
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    return matches;
  };

  const handleInputChange = (newValue: string) => {
    const cursorPos = inputRef.current?.selectionStart || 0;
    setCursorPosition(cursorPos);

    // Check if user is typing @
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      // Check if there's a space after @, if so, don't show suggestions
      if (!textAfterAt.includes(' ') && textAfterAt.length >= 0) {
        const filteredUsers = mockUsers.filter(user => 
          user.username.toLowerCase().includes(textAfterAt.toLowerCase()) ||
          user.displayName.toLowerCase().includes(textAfterAt.toLowerCase())
        );
        setSuggestions(filteredUsers.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    // Update tagged users based on current mentions
    const mentions = detectMentions(newValue);
    const currentTaggedUsers = mentions.map(mention => {
      const user = mockUsers.find(u => u.username === mention.username);
      return user || { id: mention.username, username: mention.username, displayName: mention.username, avatar: "" };
    });
    
    setTaggedUsers(currentTaggedUsers);
    onChange(newValue, currentTaggedUsers);
  };

  const handleUserSelect = (user: TaggedUser) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const newValue = 
        value.substring(0, lastAtIndex) + 
        `@${user.username} ` + 
        textAfterCursor;
      
      handleInputChange(newValue);
      setShowSuggestions(false);
      
      // Focus back to input
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = lastAtIndex + user.username.length + 2;
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  const renderTaggedText = (text: string) => {
    const mentions = detectMentions(text);
    if (mentions.length === 0) return text;

    let lastIndex = 0;
    const elements = [];

    mentions.forEach((mention, index) => {
      // Add text before mention
      if (mention.start > lastIndex) {
        elements.push(text.substring(lastIndex, mention.start));
      }
      
      // Add tagged user
      elements.push(
        <span key={index} className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
          @{mention.username}
        </span>
      );
      
      lastIndex = mention.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements;
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="relative">
      <InputComponent
        ref={inputRef as any}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        rows={multiline ? rows : undefined}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 mt-1 w-full max-w-sm bg-white border shadow-lg">
          <CardContent className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">Tag someone:</div>
            {suggestions.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
                onClick={() => handleUserSelect(user)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">
                    {user.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium">{user.displayName}</div>
                  <div className="text-xs text-gray-500">@{user.username}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserTagging;
