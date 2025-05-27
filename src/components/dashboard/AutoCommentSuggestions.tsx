
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface AutoCommentSuggestionsProps {
  onSelectComment: (comment: string) => void;
  category?: string;
}

const AUTO_COMMENTS = {
  'help-needed': [
    "I can help with this! 🙋‍♂️",
    "Happy to assist! Let me know what you need.",
    "I'm available to help. DM me! 💪",
    "Count me in! 🤝"
  ],
  'help-offered': [
    "This is so generous! 🙏",
    "Thank you for offering help!",
    "The community needs more people like you! ❤️",
    "Amazing initiative! 👏"
  ],
  'success-story': [
    "Congratulations! 🎉",
    "So inspiring! 💫",
    "Well done! 👏",
    "This made my day! 😊"
  ],
  'question': [
    "Great question! 🤔",
    "I'd love to know this too!",
    "Following for answers! 👀",
    "Interesting point! 💭"
  ],
  'default': [
    "Thanks for sharing! 🙏",
    "Great post! 👍",
    "Love this! ❤️",
    "So helpful! 🤝",
    "Amazing! 🌟",
    "Completely agree! 💯"
  ]
};

const AutoCommentSuggestions = ({ onSelectComment, category = 'default' }: AutoCommentSuggestionsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const suggestions = AUTO_COMMENTS[category as keyof typeof AUTO_COMMENTS] || AUTO_COMMENTS.default;

  const handleSelectComment = (comment: string) => {
    onSelectComment(comment);
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="text-xs text-gray-500 hover:text-gray-700"
      >
        Quick replies ✨
      </Button>
    );
  }

  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Quick replies</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            ×
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-1">
          {suggestions.map((comment, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleSelectComment(comment)}
              className="justify-start text-left h-auto py-1 px-2 text-xs text-gray-700 hover:bg-blue-50"
            >
              {comment}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoCommentSuggestions;
