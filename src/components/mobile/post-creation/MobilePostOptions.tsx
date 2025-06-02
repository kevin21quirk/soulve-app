
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import { FEELINGS, POST_CATEGORIES } from '@/components/dashboard/post-options/PostOptionsConfig';
import { PostFormData } from '@/components/dashboard/CreatePostTypes';

interface MobilePostOptionsProps {
  formData: PostFormData;
  showFeelings: boolean;
  showCategories: boolean;
  onToggleFeelings: () => void;
  onToggleCategories: () => void;
  onUpdateFormData: (updater: (prev: PostFormData) => PostFormData) => void;
}

const MobilePostOptions = ({
  formData,
  showFeelings,
  showCategories,
  onToggleFeelings,
  onToggleCategories,
  onUpdateFormData
}: MobilePostOptionsProps) => {
  const selectedFeeling = FEELINGS.find(f => f.value === formData.feeling);
  const selectedCategory = POST_CATEGORIES.find(c => c.value === formData.category);

  return (
    <div className="px-4">
      {/* Quick option buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFeelings}
          className="h-8"
        >
          {selectedFeeling ? (
            <>
              <span className="mr-1">{selectedFeeling.emoji}</span>
              <span className="text-xs">feeling {selectedFeeling.label}</span>
            </>
          ) : (
            <>
              <Smile className="h-3 w-3 mr-1" />
              <span className="text-xs">Add feeling</span>
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleCategories}
          className="h-8"
        >
          {selectedCategory ? (
            <>
              {React.createElement(selectedCategory.icon, { className: "h-3 w-3 mr-1" })}
              <span className="text-xs">{selectedCategory.label}</span>
            </>
          ) : (
            <span className="text-xs">Category</span>
          )}
        </Button>
      </div>

      {/* Feelings selector */}
      {showFeelings && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-2">How are you feeling?</div>
          <div className="flex flex-wrap gap-1">
            {FEELINGS.slice(0, 6).map((feeling) => (
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
                {feeling.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Categories selector */}
      {showCategories && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-2">What kind of post?</div>
          <div className="grid grid-cols-1 gap-2">
            {POST_CATEGORIES.slice(0, 4).map((category) => (
              <Button
                key={category.value}
                variant={formData.category === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onUpdateFormData(prev => ({ ...prev, category: category.value }));
                  onToggleCategories();
                }}
                className="h-10 justify-start"
              >
                {React.createElement(category.icon, { className: "h-4 w-4 mr-2" })}
                <span className="text-xs">{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePostOptions;
