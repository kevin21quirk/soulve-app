
export interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  description: string;
  category: "help-needed" | "help-offered" | "success-story";
  timestamp: string;
  location: string;
  responses: number;
  likes: number;
  isLiked: boolean;
}
