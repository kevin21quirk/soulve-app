
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Smile, Heart, ThumbsUp, PartyPopper, Flame, Target, Star } from 'lucide-react';

interface ModernReactionPickerProps {
  onReactionSelect: (emoji: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
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

const ModernReactionPicker = ({ onReactionSelect, children, disabled = false }: ModernReactionPickerProps) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('frequent');

  const handleReactionClick = (emoji: string) => {
    onReactionSelect(emoji);
    setOpen(false);
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

            {Object.entries(reactionCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="p-3 m-0">
                <div className="grid grid-cols-8 gap-2">
                  {category.reactions.map((emoji) => (
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
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModernReactionPicker;
