
import { PostFormData } from "./CreatePostTypes";
import CategoryUrgencySelector from "./post-options/CategoryUrgencySelector";
import FeelingSelector from "./post-options/FeelingSelector";
import TagsManager from "./post-options/TagsManager";
import VisibilityPermissions from "./post-options/VisibilityPermissions";
import PostScheduler from "./post-options/PostScheduler";
import OptionsSummary from "./post-options/OptionsSummary";

interface PostOptionsProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const PostOptions = ({ formData, onFormDataChange }: PostOptionsProps) => {
  return (
    <div className="space-y-6">
      <CategoryUrgencySelector formData={formData} onFormDataChange={onFormDataChange} />
      <FeelingSelector formData={formData} onFormDataChange={onFormDataChange} />
      <TagsManager formData={formData} onFormDataChange={onFormDataChange} />
      <VisibilityPermissions formData={formData} onFormDataChange={onFormDataChange} />
      <PostScheduler formData={formData} onFormDataChange={onFormDataChange} />
      <OptionsSummary formData={formData} />
    </div>
  );
};

export default PostOptions;
