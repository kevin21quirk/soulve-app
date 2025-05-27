
export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
}

export interface PostFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  feeling: string;
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  allowComments: boolean;
  allowSharing: boolean;
  scheduledFor?: Date;
}

export const FEELINGS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '🙏', label: 'Grateful', value: 'grateful' },
  { emoji: '😰', label: 'Worried', value: 'worried' },
  { emoji: '💪', label: 'Motivated', value: 'motivated' },
  { emoji: '🎉', label: 'Excited', value: 'excited' },
  { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
  { emoji: '🤝', label: 'Helpful', value: 'helpful' },
  { emoji: '❤️', label: 'Loved', value: 'loved' }
];

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-700', icon: '⏰' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-700', icon: '⚡' },
  { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-700', icon: '🔥' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700', icon: '🚨' }
];

export const POST_CATEGORIES = [
  { value: 'help-needed', label: 'Help Needed', icon: '🙋‍♂️' },
  { value: 'help-offered', label: 'Help Offered', icon: '🤝' },
  { value: 'success-story', label: 'Success Story', icon: '🎉' },
  { value: 'announcement', label: 'Announcement', icon: '📢' },
  { value: 'question', label: 'Question', icon: '❓' },
  { value: 'recommendation', label: 'Recommendation', icon: '⭐' },
  { value: 'event', label: 'Event', icon: '📅' },
  { value: 'lost-found', label: 'Lost & Found', icon: '🔍' }
];
