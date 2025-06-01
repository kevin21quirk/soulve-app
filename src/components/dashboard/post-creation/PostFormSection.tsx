
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import PostFormFields from "./PostFormFields";
import PostAdvancedOptions from "./PostAdvancedOptions";
import { PostFormData } from "../CreatePostTypes";
import { MediaFile } from "../media-upload/MediaUploadTypes";

interface TaggedUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface PostFormSectionProps {
  formData: PostFormData;
  onInputChange: (field: keyof PostFormData, value: any) => void;
  taggedUsers: TaggedUser[];
  onTitleChange: (value: string, users: TaggedUser[]) => void;
  onDescriptionChange: (value: string, users: TaggedUser[]) => void;
  onLocationSelect: (location: { address: string }) => void;
  mediaFiles: MediaFile[];
  onMediaChange: (files: MediaFile[]) => void;
  showAdvancedOptions: boolean;
  onToggleAdvancedOptions: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const PostFormSection = ({
  formData,
  onInputChange,
  taggedUsers,
  onTitleChange,
  onDescriptionChange,
  onLocationSelect,
  mediaFiles,
  onMediaChange,
  showAdvancedOptions,
  onToggleAdvancedOptions,
  onSubmit,
  onCancel
}: PostFormSectionProps) => {
  const isFormValid = formData.title.trim() && formData.description.trim() && formData.category;

  return (
    <Card className="mb-6 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Create New Post</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} type="button">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <PostFormFields
            formData={formData}
            onInputChange={onInputChange}
            taggedUsers={taggedUsers}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
            onLocationSelect={onLocationSelect}
          />

          {/* Always show advanced options */}
          <PostAdvancedOptions
            formData={formData}
            onFormDataChange={onInputChange}
            mediaFiles={mediaFiles}
            onMediaChange={onMediaChange}
          />

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onToggleAdvancedOptions}
            >
              <FileText className="h-4 w-4 mr-2" />
              Use Template
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
            >
              {formData.scheduledFor ? "Schedule Post" : "Share Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostFormSection;
