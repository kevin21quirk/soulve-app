
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Smile, Users, X } from 'lucide-react';
import { FEELINGS, POST_CATEGORIES } from '../../post-options/PostOptionsConfig';
import { PostFormData } from '../../CreatePostTypes';
import { User } from '@supabase/supabase-js';

interface PostHeaderProps {
  user: User | null;
  showFeelings: boolean;
  showCategories: boolean;
  formData: PostFormData;
  onToggleFeelings: () => void;
  onToggleCategories: () => void;
  onUpdateFormData: (updater: (prev: PostFormData) => PostFormData) => void;
  onCancel: () => void;
}

export const PostHeader = ({
  user,
  showFeelings,
  showCategories,
  formData,
  onToggleFeelings,
  onToggleCategories,
  onUpdateFormData,
  onCancel
}: PostHeaderProps) => {
  const selectedFeeling = FEELINGS.find(f => f.value === formData.feeling);
  const selectedCategory = POST_CATEGORIES.find(c => c.value === formData.category);

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
          <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
            {user?.user_metadata?.first_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium text-sm">
            {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFeelings}
              className="h-7 px-2 text-xs"
            >
              {selectedFeeling ? (
                <>
                  <span className="mr-1">{selectedFeeling.emoji}</span>
                  <span>feeling {selectedFeeling.label}</span>
                </>
              ) : (
                <>
                  <Smile className="h-3 w-3 mr-1" />
                  <span>Add feeling</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleCategories}
              className="h-7 px-2 text-xs"
            >
              {selectedCategory ? (
                <>
                  {React.createElement(selectedCategory.icon, { className: "h-3 w-3 mr-1" })}
                  <span>{selectedCategory.label}</span>
                </>
              ) : (
                <>
                  <Users className="h-3 w-3 mr-1" />
                  <span>Category</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Feelings dropdown */}
      {showFeelings && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-2">How are you feeling?</div>
          <div className="flex flex-wrap gap-1">
            {FEELINGS.map((feeling) => (
              <Button
                key={feeling.value}
                variant={formData.feeling === feeling.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onUpdateFormData(prev => ({ ...prev, feeling: feeling.value }));
                  onToggleFeelings();
                }}
                className="h-8 px-2 text-xs"
              >
                <span className="mr-1">{feeling.emoji}</span>
                <span>{feeling.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Categories dropdown */}
      {showCategories && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-2">What kind of post is this?</div>
          <div className="grid grid-cols-2 gap-2">
            {POST_CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={formData.category === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onUpdateFormData(prev => ({ ...prev, category: category.value }));
                  onToggleCategories();
                }}
                className="h-10 px-3 text-xs justify-start"
              >
                {React.createElement(category.icon, { className: "h-4 w-4 mr-2" })}
                <div>
                  <div className="font-medium">{category.label}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
