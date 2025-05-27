
import { useToast } from "@/hooks/use-toast";
import { FeedPost } from "@/types/feed";

export const usePostInteractions = (
  posts: FeedPost[], 
  setPosts: React.Dispatch<React.SetStateAction<FeedPost[]>>
) => {
  const { toast } = useToast();

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    toast({
      title: "Post shared!",
      description: "This post has been shared with your network.",
    });
  };

  const handleRespond = (postId: string) => {
    toast({
      title: "Response sent!",
      description: "Your offer to help has been sent to the requester.",
    });
  };

  return {
    handleLike,
    handleShare,
    handleRespond,
  };
};
