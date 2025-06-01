
import EnhancedMediaUpload from "./EnhancedMediaUpload";
import PostOptions from "../PostOptions";
import { PostFormData } from "../CreatePostTypes";
import { MediaFile } from "../media-upload/MediaUploadTypes";

interface PostAdvancedOptionsProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
  mediaFiles: MediaFile[];
  onMediaChange: (files: MediaFile[]) => void;
}

const PostAdvancedOptions = ({
  formData,
  onFormDataChange,
  mediaFiles,
  onMediaChange
}: PostAdvancedOptionsProps) => {
  return (
    <div className="space-y-6">
      {/* Enhanced Media Upload */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Media Upload
        </label>
        <EnhancedMediaUpload
          onMediaChange={onMediaChange}
          maxFiles={5}
          maxFileSize={10}
        />
      </div>

      {/* Post Options */}
      <PostOptions
        formData={formData}
        onFormDataChange={onFormDataChange}
      />
    </div>
  );
};

export default PostAdvancedOptions;
