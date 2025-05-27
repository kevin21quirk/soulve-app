
import React from "react";

interface TaggedTextProps {
  text: string;
  className?: string;
  onUserClick?: (username: string) => void;
}

const TaggedText = ({ text, className = "", onUserClick }: TaggedTextProps) => {
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

  const renderContent = () => {
    const mentions = detectMentions(text);
    if (mentions.length === 0) return text;

    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    mentions.forEach((mention, index) => {
      // Add text before mention
      if (mention.start > lastIndex) {
        elements.push(text.substring(lastIndex, mention.start));
      }
      
      // Add tagged user
      elements.push(
        <span 
          key={`mention-${index}`}
          className="text-blue-600 font-medium bg-blue-50 px-1 rounded cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => onUserClick?.(mention.username)}
        >
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

  return (
    <span className={className}>
      {renderContent()}
    </span>
  );
};

export default TaggedText;
