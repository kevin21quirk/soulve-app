
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Smile, Heart, ThumbsUp, PartyPopper, Flame, Target, Star } from 'lucide-react';

interface ModernReactionPickerProps {
  onReactionSelect: (emoji: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  userReactedEmojis?: string[]; // List of emojis user has already reacted with
}

const reactionCategories = {
  frequent: {
    icon: ThumbsUp,
    label: 'Frequent',
    reactions: ['👍', '❤️', '😂', '😮', '🔥', '💯']
  },
  emotions: {
    icon: Smile,
    label: 'Emotions',
    reactions: ['😊', '😂', '🤣', '😍', '🥰', '😘', '😎', '🤔', '😮', '😢', '😭', '😡', '🤯', '😴', '🙄', '😬']
  },
  support: {
    icon: Heart,
    label: 'Support',
    reactions: ['❤️', '💙', '💚', '💛', '🧡', '💜', '🤍', '🖤', '🤲', '🙏', '💪', '🤝', '👏', '🙌', '✊', '👊']
  },
  celebration: {
    icon: PartyPopper,
    label: 'Celebration',
    reactions: ['🎉', '🎊', '🥳', '✨', '⭐', '🌟', '💫', '🎯', '🏆', '🥇', '🎁', '🎈', '🎂', '🍾', '🥂', '🎵']
  },
  action: {
    icon: Target,
    label: 'Action',
    reactions: ['🚀', '⚡', '💥', '🔥', '💯', '✅', '❌', '⚠️', '💡', '🎯', '🔔', '📢', '👀', '💭', '💬', '📝']
  }
};

const ModernReactionPicker = ({ onReactionSelect, children, disabled = false, userReactedEmojis = [] }: ModernReactionPickerProps) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('frequent');

  const handleReactionClick = (emoji: string) => {
    onReactionSelect(emoji);
    setOpen(false);
  };

  // Filter out reactions user has already made
  const getFilteredReactions = (reactions: string[]) => {
    return reactions.filter(emoji => !userReactedEmojis.includes(emoji));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" sideOffset={5}>
        <div className="bg-white rounded-lg shadow-lg border">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1">
              {Object.entries(reactionCategories).map(([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="p-2 h-auto flex flex-col items-center gap-1 text-xs"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(reactionCategories).map(([key, category]) => {
              const filteredReactions = getFilteredReactions(category.reactions);
              return (
                <TabsContent key={key} value={key} className="p-3 m-0">
                  {filteredReactions.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm py-4">
                      You've already used all reactions in this category
                    </div>
                  ) : (
                    <div className="grid grid-cols-8 gap-2">
                      {filteredReactions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReactionClick(emoji)}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModernReactionPicker;
