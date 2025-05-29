
import React from "react";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { CampaignFormData } from "@/services/campaignService";
import { type CampaignTemplate } from "@/services/campaignTemplateService";

interface BasicInfoTabProps {
  register: UseFormRegister<CampaignFormData>;
  setValue: UseFormSetValue<CampaignFormData>;
  errors: FieldErrors<CampaignFormData>;
  selectedTemplate?: CampaignTemplate | null;
  category?: string;
}

const BasicInfoTab = ({ register, setValue, errors, selectedTemplate, category }: BasicInfoTabProps) => {
  return (
    <div className="space-y-6 mt-6">
      {selectedTemplate && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Template Applied</span>
          </div>
          <p className="text-sm text-yellow-700">
            Fields have been pre-filled with content from the <strong>{selectedTemplate.name}</strong> template. 
            Feel free to customize any field to match your specific needs.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title *</Label>
          <Input
            id="title"
            placeholder="Enter a compelling title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Campaign Type *</Label>
          <Select onValueChange={(value: any) => setValue('category', value)} value={category}>
            <SelectTrigger>
              <SelectValue placeholder="Select campaign type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fundraising">Fundraising</SelectItem>
              <SelectItem value="volunteer">Volunteer</SelectItem>
              <SelectItem value="awareness">Awareness</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="petition">Petition</SelectItem>
              <SelectItem value="social_cause">Social Cause</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization_type">Organization Type *</Label>
          <Select onValueChange={(value: any) => setValue('organization_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="charity">Charity</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="social_group">Social Group</SelectItem>
              <SelectItem value="community_group">Community Group</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, Country"
            {...register("location")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description *</Label>
        <Textarea
          id="description"
          placeholder="Briefly describe your campaign (1-2 sentences)"
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>
    </div>
  );
};

export default BasicInfoTab;
