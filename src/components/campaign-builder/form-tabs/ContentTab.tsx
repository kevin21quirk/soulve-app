
import React, { useState } from "react";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignFormData } from "@/services/campaignService";

interface ContentTabProps {
  register: UseFormRegister<CampaignFormData>;
  setValue: UseFormSetValue<CampaignFormData>;
  errors: FieldErrors<CampaignFormData>;
  tags: string[];
  setTags: (tags: string[]) => void;
}

const ContentTab = ({ register, setValue, errors, tags, setTags }: ContentTabProps) => {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-2">
        <Label htmlFor="story">Campaign Story *</Label>
        <Textarea
          id="story"
          placeholder="Tell your story in detail. Explain why this campaign matters, what impact it will have, and why people should support it."
          rows={8}
          {...register("story", { required: "Campaign story is required" })}
        />
        {errors.story && <p className="text-sm text-red-600">{errors.story.message}</p>}
      </div>

      <div className="space-y-4">
        <Label>Tags</Label>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentTab;
