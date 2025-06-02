
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Calendar, 
  Users, 
  Star, 
  Play, 
  Search, 
  Sparkles,
  Loader2
} from 'lucide-react';
import ReliveStoryViewer from './ReliveStoryViewer';
import { motion } from 'framer-motion';
import { useReliveStories } from '@/hooks/useReliveStories';
import { ReliveStory } from '@/services/reliveStoriesService';

const ReliveMemoriesDashboard = () => {
  const { stories, loading, error, loadPublicStories } = useReliveStories();
  const [selectedStory, setSelectedStory] = useState<ReliveStory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'my_stories' | 'public'>('my_stories');

  useEffect(() => {
    if (viewMode === 'public') {
      loadPublicStories();
    }
  }, [viewMode]);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.preview_text?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || story.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'help_needed': 'from-red-400 to-pink-600',
      'help_offered': 'from-green-400 to-emerald-600',
      'volunteer': 'from-purple-400 to-indigo-600',
      'donation': 'from-yellow-400 to-orange-600',
      'success_story': 'from-blue-400 to-purple-600',
    };
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const getTotalStats = () => {
    return stories.reduce(
      (acc, story) => ({
        totalPoints: acc.totalPoints + (story.total_impact.pointsEarned || 0),
        totalPeople: acc.totalPeople + (story.total_impact.peopleHelped || 0),
        totalHours: acc.totalHours + (story.total_impact.hoursContributed || 0),
        totalStories: acc.totalStories + 1,
      }),
      { totalPoints: 0, totalPeople: 0, totalHours: 0, totalStories: 0 }
    );
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-2 text-gray-600">Loading your stories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relive Your Journey</h1>
            <p className="text-gray-600">Take a trip down memory lane through your impact stories</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center space-x-2">
          <Button
            variant={viewMode === 'my_stories' ? 'default' : 'outline'}
            onClick={() => setViewMode('my_stories')}
          >
            My Stories
          </Button>
          <Button
            variant={viewMode === 'public' ? 'default' : 'outline'}
            onClick={() => setViewMode('public')}
          >
            Community Stories
          </Button>
        </div>

        {/* Overall Stats - only show for user's own stories */}
        {viewMode === 'my_stories' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalStories}</div>
              <div className="text-sm text-gray-600">Stories</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.totalPoints}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.totalPeople}</div>
              <div className="text-sm text-gray-600">People Helped</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.totalHours}</div>
              <div className="text-sm text-gray-600">Hours Given</div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="all">All Categories</option>
          <option value="help_needed">Help Needed</option>
          <option value="help_offered">Help Offered</option>
          <option value="volunteer">Volunteer</option>
          <option value="donation">Donation</option>
          <option value="success_story">Success Story</option>
        </select>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className={`h-48 bg-gradient-to-r ${getCategoryColor(story.category)} relative overflow-hidden`}>
                {story.cover_image ? (
                  <img
                    src={story.cover_image}
                    alt={story.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="h-16 w-16 text-white/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/40 text-white border-0">
                    {story.category.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-2">{story.title}</h3>
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(story.start_date).toLocaleDateString()}</span>
                    {story.completed_date && (
                      <>
                        <span>•</span>
                        <span>Completed</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setSelectedStory(story)}
                    className="bg-white/90 text-black hover:bg-white"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Relive Story
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {story.preview_text || 'A journey of community impact and collaboration'}
                </p>

                {/* Emotions */}
                <div className="flex space-x-1">
                  {story.emotions.slice(0, 3).map((emotion, index) => (
                    <span key={index} className="text-lg">{emotion}</span>
                  ))}
                </div>

                {/* Participants */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {story.participants.slice(0, 3).map((participant, index) => (
                      <Avatar key={index} className="w-6 h-6 border-2 border-white">
                        <AvatarImage src={participant.profile?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {participant.profile?.first_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {story.participants.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                        +{story.participants.length - 3}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {story.participants.find(p => p.user_id === story.participants[0]?.user_id)?.role || 'participant'}
                  </Badge>
                </div>

                {/* Impact Summary */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">+{story.total_impact.pointsEarned}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{story.total_impact.peopleHelped}</div>
                    <div className="text-xs text-gray-500">helped</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{story.total_impact.hoursContributed}</div>
                    <div className="text-xs text-gray-500">hours</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedStory(story)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Relive This Journey
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No memories found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery ? 'Try adjusting your search terms' : viewMode === 'my_stories' 
              ? 'Start helping others to create your first memory!' 
              : 'No public stories available yet.'}
          </p>
        </div>
      )}

      {/* Story Viewer Modal */}
      {selectedStory && (
        <ReliveStoryViewer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onShare={(story) => {
            navigator.share?.({
              title: `My Impact Story: ${story.title}`,
              text: story.total_impact.emotionalImpact,
              url: window.location.href
            });
          }}
        />
      )}
    </div>
  );
};

export default ReliveMemoriesDashboard;
