
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";

interface TagsManagerProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const TagsManager = ({ formData, onFormDataChange }: TagsManagerProps) => {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      onFormDataChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onFormDataChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {formData.tags.map((tag) => (
          <div key={tag} className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 shadow-sm">
            <span>#{tag}</span>
            <X className="h-3 w-3 cursor-pointer hover:bg-white/20 rounded-full p-0.5" onClick={() => removeTag(tag)} />
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          placeholder="Add a tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          className="flex-1"
        />
        <Button onClick={addTag} size="sm" variant="outline" type="button" className="border-soulve-teal text-soulve-teal hover:bg-soulve-teal/10">
          Add
        </Button>
      </div>
    </div>
  );
};

export default TagsManager;
