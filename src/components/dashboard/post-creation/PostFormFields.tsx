
import UserTagging from "../tagging/UserTagging";
import LocationSelector from "./LocationSelector";
import { PostFormData } from "../CreatePostTypes";

interface TaggedUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface PostFormFieldsProps {
  formData: PostFormData;
  onInputChange: (field: keyof PostFormData, value: any) => void;
  taggedUsers: TaggedUser[];
  onTitleChange: (value: string, users: TaggedUser[]) => void;
  onDescriptionChange: (value: string, users: TaggedUser[]) => void;
  onLocationSelect: (location: { address: string }) => void;
  onTaggedUsersChange?: (users: TaggedUser[]) => void;
}

const PostFormFields = ({
  formData,
  onInputChange,
  taggedUsers,
  onTitleChange,
  onDescriptionChange,
  onLocationSelect,
  onTaggedUsersChange
}: PostFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Title *
        </label>
        <UserTagging
          value={formData.title}
          onChange={onTitleChange}
          placeholder="What's the title of your post? (Type @ to tag someone)"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Description *
        </label>
        <UserTagging
          value={formData.description}
          onChange={(value, users) => {
            onDescriptionChange(value, users);
            if (onTaggedUsersChange) {
              onTaggedUsersChange(users);
            }
          }}
          placeholder="Describe what you need or want to offer... (Type @ to tag someone)"
          multiline
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          <span className="flex items-center">
            <svg className="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location
          </span>
        </label>
        <LocationSelector
          onLocationSelect={onLocationSelect}
          initialLocation={formData.location}
        />
      </div>

      {/* Show tagged users */}
      {taggedUsers.length > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">Tagged users:</div>
          <div className="flex flex-wrap gap-2">
            {taggedUsers.map((user, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                @{user.username}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFormFields;
