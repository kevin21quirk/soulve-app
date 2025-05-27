
import { useToast } from "@/hooks/use-toast";
import { FeedPost, Comment } from "@/types/feed";

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
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isShared: true,
              shares: post.shares + 1
            }
          : post
      )
    );
    
    toast({
      title: "Post shared!",
      description: "This post has been shared with your network.",
    });
  };

  const handleBookmark = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
    
    const post = posts.find(p => p.id === postId);
    toast({
      title: post?.isBookmarked ? "Bookmark removed" : "Post bookmarked!",
      description: post?.isBookmarked ? "Post removed from bookmarks." : "Post saved to your bookmarks.",
    });
  };

  const handleReaction = (postId: string, reactionType: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        const reactions = post.reactions || [];
        const existingReaction = reactions.find(r => r.type === reactionType);
        const userHasReacted = reactions.some(r => r.hasReacted);
        
        let updatedReactions;
        
        if (userHasReacted) {
          // Remove user's previous reaction and add new one
          updatedReactions = reactions.map(r => 
            r.hasReacted 
              ? { ...r, hasReacted: false, count: Math.max(0, r.count - 1) }
              : r
          );
          
          if (existingReaction) {
            updatedReactions = updatedReactions.map(r =>
              r.type === reactionType 
                ? { ...r, hasReacted: true, count: r.count + 1 }
                : r
            );
          } else {
            updatedReactions.push({ 
              type: reactionType, 
              emoji: getReactionEmoji(reactionType), 
              count: 1, 
              hasReacted: true 
            });
          }
        } else {
          // Add new reaction
          if (existingReaction) {
            updatedReactions = reactions.map(r =>
              r.type === reactionType 
                ? { ...r, hasReacted: true, count: r.count + 1 }
                : r
            );
          } else {
            updatedReactions = [...reactions, { 
              type: reactionType, 
              emoji: getReactionEmoji(reactionType), 
              count: 1, 
              hasReacted: true 
            }];
          }
        }
        
        return { ...post, reactions: updatedReactions };
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: "You",
      avatar: "",
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      reactions: [], // Initialize with empty reactions array
    };

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: [...(post.comments || []), newComment]
            }
          : post
      )
    );
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        const updateCommentsLikes = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateCommentsLikes(comment.replies)
              };
            }
            return comment;
          });
        };
        
        return {
          ...post,
          comments: updateCommentsLikes(post.comments || [])
        };
      })
    );
  };

  const handleCommentReaction = (postId: string, commentId: string, reactionType: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        const updateCommentReactions = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              const reactions = comment.reactions || [];
              const existingReaction = reactions.find(r => r.type === reactionType);
              const userHasReacted = reactions.some(r => r.hasReacted);
              
              let updatedReactions;
              
              if (userHasReacted) {
                // Remove user's previous reaction and add new one
                updatedReactions = reactions.map(r => 
                  r.hasReacted 
                    ? { ...r, hasReacted: false, count: Math.max(0, r.count - 1) }
                    : r
                );
                
                if (existingReaction) {
                  updatedReactions = updatedReactions.map(r =>
                    r.type === reactionType 
                      ? { ...r, hasReacted: true, count: r.count + 1 }
                      : r
                  );
                } else {
                  updatedReactions.push({ 
                    type: reactionType, 
                    emoji: getReactionEmoji(reactionType), 
                    count: 1, 
                    hasReacted: true 
                  });
                }
              } else {
                // Add new reaction
                if (existingReaction) {
                  updatedReactions = reactions.map(r =>
                    r.type === reactionType 
                      ? { ...r, hasReacted: true, count: r.count + 1 }
                      : r
                  );
                } else {
                  updatedReactions = [...reactions, { 
                    type: reactionType, 
                    emoji: getReactionEmoji(reactionType), 
                    count: 1, 
                    hasReacted: true 
                  }];
                }
              }
              
              return { ...comment, reactions: updatedReactions };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateCommentReactions(comment.replies)
              };
            }
            return comment;
          });
        };
        
        return {
          ...post,
          comments: updateCommentReactions(post.comments || [])
        };
      })
    );
  };

  const handleRespond = (postId: string) => {
    toast({
      title: "Response sent!",
      description: "Your offer to help has been sent to the requester.",
    });
  };

  const getReactionEmoji = (type: string) => {
    const emojiMap: { [key: string]: string } = {
      'like': '👍',
      'love': '❤️',
      'support': '🤝',
      'laugh': '😂',
      'wow': '😮',
      'sad': '😢',
      'angry': '😠',
    };
    return emojiMap[type] || '👍';
  };

  return {
    handleLike,
    handleShare,
    handleRespond,
    handleBookmark,
    handleReaction,
    handleAddComment,
    handleLikeComment,
    handleCommentReaction,
  };
};
