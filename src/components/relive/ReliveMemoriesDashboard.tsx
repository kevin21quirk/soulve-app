
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
  Filter,
  Sparkles,
  Clock,
  MapPin,
  TrendingUp
} from 'lucide-react';
import ReliveStoryViewer from './ReliveStoryViewer';
import { motion } from 'framer-motion';

interface ReliveStory {
  id: string;
  title: string;
  category: string;
  startDate: string;
  completedDate?: string;
  coverImage: string;
  participants: {
    avatar: string;
    name: string;
    role: string;
  }[];
  updates: any[];
  userRole: 'creator' | 'helper' | 'beneficiary' | 'supporter';
  totalImpact: {
    pointsEarned: number;
    peopleHelped: number;
    hoursContributed: number;
    emotionalImpact: string;
  };
  previewText: string;
  emotions: string[];
}

const ReliveMemoriesDashboard = () => {
  const [stories, setStories] = useState<ReliveStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<ReliveStory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockStories: ReliveStory[] = [
      {
        id: '1',
        title: 'Community Garden Project',
        category: 'volunteer',
        startDate: '2024-01-15',
        completedDate: '2024-02-28',
        coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        participants: [
          { avatar: 'https://avatar.vercel.sh/sarah.png', name: 'Sarah Chen', role: 'Organizer' },
          { avatar: 'https://avatar.vercel.sh/mike.png', name: 'Mike Johnson', role: 'Volunteer' },
          { avatar: 'https://avatar.vercel.sh/emma.png', name: 'Emma Wilson', role: 'Helper' },
        ],
        updates: [
          {
            id: '1',
            type: 'progress',
            title: 'Breaking Ground',
            content: 'We started by clearing the lot and planning the layout. So exciting to see the vision coming to life!',
            mediaUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
            mediaType: 'image',
            timestamp: '2024-01-20',
            author: 'Sarah Chen',
            authorAvatar: 'https://avatar.vercel.sh/sarah.png',
            emotions: ['Excited', 'Hopeful'],
            stats: { hoursContributed: 8, impactReach: 50 }
          },
          {
            id: '2',
            type: 'completion',
            title: 'First Harvest!',
            content: 'Our first vegetables are ready! The community came together to harvest and share the bounty. This project brought so many people together.',
            mediaUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
            mediaType: 'image',
            timestamp: '2024-02-28',
            author: 'Mike Johnson',
            authorAvatar: 'https://avatar.vercel.sh/mike.png',
            emotions: ['Grateful', 'Proud', 'Happy'],
            stats: { helpedCount: 25, hoursContributed: 40, impactReach: 200 }
          }
        ],
        userRole: 'helper',
        totalImpact: {
          pointsEarned: 150,
          peopleHelped: 25,
          hoursContributed: 48,
          emotionalImpact: 'Brought community together through sustainable food'
        },
        previewText: 'A journey of growing food and friendships in the heart of our neighborhood',
        emotions: ['😊', '🌱', '🤝']
      },
      {
        id: '2',
        title: 'Helping Mrs. Johnson with Groceries',
        category: 'help-needed',
        startDate: '2024-02-10',
        completedDate: '2024-02-10',
        coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        participants: [
          { avatar: 'https://avatar.vercel.sh/johnson.png', name: 'Mrs. Johnson', role: 'Requester' },
          { avatar: 'https://avatar.vercel.sh/alex.png', name: 'Alex Rodriguez', role: 'Helper' },
        ],
        updates: [
          {
            id: '1',
            type: 'completion',
            title: 'Mission Accomplished',
            content: 'Successfully helped Mrs. Johnson with her weekly grocery shopping. She was so grateful and we had wonderful conversations!',
            mediaUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
            mediaType: 'image',
            timestamp: '2024-02-10',
            author: 'Alex Rodriguez',
            authorAvatar: 'https://avatar.vercel.sh/alex.png',
            emotions: ['Grateful', 'Connected'],
            stats: { helpedCount: 1, hoursContributed: 2 }
          }
        ],
        userRole: 'helper',
        totalImpact: {
          pointsEarned: 25,
          peopleHelped: 1,
          hoursContributed: 2,
          emotionalImpact: 'Made a senior feel supported and less isolated'
        },
        previewText: 'A simple act of kindness that created a lasting connection',
        emotions: ['❤️', '🛒', '👵']
      },
      {
        id: '3',
        title: 'Book Drive for Local School',
        category: 'donation',
        startDate: '2024-01-05',
        completedDate: '2024-01-30',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        participants: [
          { avatar: 'https://avatar.vercel.sh/lisa.png', name: 'Lisa Park', role: 'Organizer' },
          { avatar: 'https://avatar.vercel.sh/david.png', name: 'David Kim', role: 'Donor' },
          { avatar: 'https://avatar.vercel.sh/maria.png', name: 'Maria Garcia', role: 'Volunteer' },
        ],
        updates: [
          {
            id: '1',
            type: 'progress',
            title: 'Donation Drive Begins',
            content: 'Started collecting books from the community. The response has been overwhelming!',
            mediaUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
            mediaType: 'image',
            timestamp: '2024-01-10',
            author: 'Lisa Park',
            authorAvatar: 'https://avatar.vercel.sh/lisa.png',
            emotions: ['Excited', 'Hopeful']
          },
          {
            id: '2',
            type: 'completion',
            title: 'Books Delivered to School',
            content: 'We collected over 500 books! Seeing the children\'s faces light up when they saw all the new books was priceless.',
            mediaUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
            mediaType: 'image',
            timestamp: '2024-01-30',
            author: 'Maria Garcia',
            authorAvatar: 'https://avatar.vercel.sh/maria.png',
            emotions: ['Proud', 'Happy', 'Inspired'],
            stats: { helpedCount: 300, impactReach: 500 }
          }
        ],
        userRole: 'supporter',
        totalImpact: {
          pointsEarned: 75,
          peopleHelped: 300,
          hoursContributed: 12,
          emotionalImpact: 'Opened worlds of knowledge for hundreds of children'
        },
        previewText: 'Filling young minds with stories and endless possibilities',
        emotions: ['📚', '🎉', '✨']
      }
    ];

    setTimeout(() => {
      setStories(mockStories);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.previewText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || story.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'help-needed': 'from-red-400 to-pink-600',
      'help-offered': 'from-green-400 to-emerald-600',
      'volunteer': 'from-purple-400 to-indigo-600',
      'donation': 'from-yellow-400 to-orange-600',
      'success-story': 'from-blue-400 to-purple-600',
    };
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const getTotalStats = () => {
    return stories.reduce(
      (acc, story) => ({
        totalPoints: acc.totalPoints + story.totalImpact.pointsEarned,
        totalPeople: acc.totalPeople + story.totalImpact.peopleHelped,
        totalHours: acc.totalHours + story.totalImpact.hoursContributed,
        totalStories: acc.totalStories + 1,
      }),
      { totalPoints: 0, totalPeople: 0, totalHours: 0, totalStories: 0 }
    );
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
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

        {/* Overall Stats */}
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
          <option value="help-needed">Help Needed</option>
          <option value="help-offered">Help Offered</option>
          <option value="volunteer">Volunteer</option>
          <option value="donation">Donation</option>
          <option value="success-story">Success Story</option>
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
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/40 text-white border-0">
                    {story.category.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-2">{story.title}</h3>
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(story.startDate).toLocaleDateString()}</span>
                    {story.completedDate && (
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
                  {story.previewText}
                </p>

                {/* Emotions */}
                <div className="flex space-x-1">
                  {story.emotions.map((emotion, index) => (
                    <span key={index} className="text-lg">{emotion}</span>
                  ))}
                </div>

                {/* Participants */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {story.participants.slice(0, 3).map((participant, index) => (
                      <Avatar key={index} className="w-6 h-6 border-2 border-white">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {story.participants.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                        +{story.participants.length - 3}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {story.userRole}
                  </Badge>
                </div>

                {/* Impact Summary */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">+{story.totalImpact.pointsEarned}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{story.totalImpact.peopleHelped}</div>
                    <div className="text-xs text-gray-500">helped</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{story.totalImpact.hoursContributed}</div>
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
            {searchQuery ? 'Try adjusting your search terms' : 'Start helping others to create your first memory!'}
          </p>
        </div>
      )}

      {/* Story Viewer Modal */}
      {selectedStory && (
        <ReliveStoryViewer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onShare={(story) => {
            // Handle sharing logic
            navigator.share?.({
              title: `My Impact Story: ${story.title}`,
              text: story.totalImpact.emotionalImpact,
              url: window.location.href
            });
          }}
        />
      )}
    </div>
  );
};

export default ReliveMemoriesDashboard;
