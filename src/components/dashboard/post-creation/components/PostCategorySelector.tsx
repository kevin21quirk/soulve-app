
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { POST_CATEGORIES } from '../../post-options/PostOptionsConfig';

interface PostCategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const PostCategorySelector = ({ selectedCategory, onCategorySelect }: PostCategorySelectorProps) => {
  return (
    <div className="px-4">
      <Select value={selectedCategory} onValueChange={onCategorySelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {POST_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              <div className="flex items-center space-x-2">
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PostCategorySelector;
