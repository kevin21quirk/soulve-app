
import ErrorBoundary from "@/components/ui/error-boundary";
import FeedFilters from "./FeedFilters";
import CreatePost from "./CreatePost";
import SearchBar from "./SearchBar";
import PostSkeleton from "./PostSkeleton";
import FeedPostCard from "./FeedPostCard";
import { useSocialFeed } from "@/hooks/useSocialFeed";

const SocialFeed = () => {
  const {
    filteredPosts,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    handlePostCreated,
    handleLike,
    handleShare,
    handleRespond,
    getPostCounts,
  } = useSocialFeed();

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h2>
          <p className="text-gray-600">See what your community needs and how you can help</p>
        </div>

        <CreatePost onPostCreated={handlePostCreated} />

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <FeedFilters 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            postCounts={getPostCounts()}
          />
          
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Search posts, authors, locations..."
            className="w-full md:w-80"
          />
        </div>

        <div className="space-y-4">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2].map((i) => <PostSkeleton key={i} />)}
            </div>
          )}

          {!isLoading && filteredPosts.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onShare={handleShare}
              onRespond={handleRespond}
            />
          ))}
        </div>

        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            {searchQuery ? (
              <>
                <p className="text-gray-500 text-lg">No posts found matching "{searchQuery}"</p>
                <p className="text-gray-400">Try adjusting your search terms or filter.</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg">No posts found for this category.</p>
                <p className="text-gray-400">Try selecting a different filter above.</p>
              </>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SocialFeed;
