
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Calendar, 
  Users, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReliveStory } from '@/services/reliveStoriesService';

interface ReliveStoryViewerProps {
  story: ReliveStory;
  onClose: () => void;
  onShare?: (story: ReliveStory) => void;
}

const ReliveStoryViewer = ({ story, onClose, onShare }: ReliveStoryViewerProps) => {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentUpdate = story.updates[currentUpdateIndex];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || story.updates.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentUpdateIndex(prev => 
        prev < story.updates.length - 1 ? prev + 1 : 0
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, story.updates.length]);

  const nextUpdate = () => {
    setCurrentUpdateIndex(prev => 
      prev < story.updates.length - 1 ? prev + 1 : prev
    );
  };

  const prevUpdate = () => {
    setCurrentUpdateIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  const getGradientForCategory = (category: string) => {
    const gradients = {
      'help_needed': 'from-red-400 to-pink-600',
      'help_offered': 'from-green-400 to-emerald-600',
      'success_story': 'from-blue-400 to-purple-600',
      'volunteer': 'from-purple-400 to-indigo-600',
      'donation': 'from-yellow-400 to-orange-600',
    };
    return gradients[category as keyof typeof gradients] || 'from-gray-400 to-gray-600';
  };

  // If no updates, show story overview
  if (!story.updates || story.updates.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className={`bg-gradient-to-r ${getGradientForCategory(story.category)} p-6 text-white relative`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              ✕
            </Button>
            
            <div className="flex items-start space-x-4">
              {story.cover_image ? (
                <img
                  src={story.cover_image}
                  alt={story.title}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <Heart className="h-8 w-8" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{story.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-white/80">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(story.start_date).toLocaleDateString()}</span>
                  </span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {story.category.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 text-center">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No story updates yet</h3>
            <p className="text-gray-600 mb-6">
              This story is waiting for updates to create the relive experience.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl h-full max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getGradientForCategory(story.category)} p-6 text-white relative`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            ✕
          </Button>
          
          <div className="flex items-start space-x-4 mb-4">
            {story.cover_image ? (
              <img
                src={story.cover_image}
                alt={story.title}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                <Heart className="h-8 w-8" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{story.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(story.start_date).toLocaleDateString()}</span>
                </span>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {story.category.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-4 w-4" />
            <div className="flex -space-x-2">
              {story.participants.slice(0, 5).map((participant, index) => (
                <Avatar key={index} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={participant.profile?.avatar_url} />
                  <AvatarFallback>{participant.profile?.first_name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
              ))}
              {story.participants.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs">
                  +{story.participants.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex space-x-1">
            {story.updates.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded ${
                  index <= currentUpdateIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Story Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUpdateIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-6"
            >
              {/* Media */}
              {currentUpdate.media_url && (
                <div className="relative rounded-xl overflow-hidden mb-6 h-64">
                  {currentUpdate.media_type === 'video' ? (
                    <video
                      src={currentUpdate.media_url}
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={currentUpdate.media_url}
                      alt={currentUpdate.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge variant="secondary" className="bg-black/40 text-white border-0 mb-2">
                      {currentUpdate.update_type}
                    </Badge>
                    <h3 className="text-xl font-semibold">{currentUpdate.title}</h3>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="text-white space-y-4">
                {!currentUpdate.media_url && (
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 mb-2">
                      {currentUpdate.update_type}
                    </Badge>
                    <h3 className="text-2xl font-semibold text-white">{currentUpdate.title}</h3>
                  </div>
                )}

                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={currentUpdate.author?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {currentUpdate.author?.first_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{currentUpdate.author?.first_name} {currentUpdate.author?.last_name}</span>
                  <span>•</span>
                  <span>{new Date(currentUpdate.created_at).toLocaleDateString()}</span>
                </div>

                <p className="text-gray-200 leading-relaxed">
                  {currentUpdate.content}
                </p>

                {/* Emotions */}
                {currentUpdate.emotions && currentUpdate.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentUpdate.emotions.map((emotion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-white/10 text-white border-white/30"
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Stats */}
                {currentUpdate.stats && Object.keys(currentUpdate.stats).length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {currentUpdate.stats.helpedCount && (
                      <div className="text-center p-3 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {currentUpdate.stats.helpedCount}
                        </div>
                        <div className="text-xs text-gray-300">People Helped</div>
                      </div>
                    )}
                    {currentUpdate.stats.hoursContributed && (
                      <div className="text-center p-3 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {currentUpdate.stats.hoursContributed}
                        </div>
                        <div className="text-xs text-gray-300">Hours</div>
                      </div>
                    )}
                    {currentUpdate.stats.impactReach && (
                      <div className="text-center p-3 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">
                          {currentUpdate.stats.impactReach}
                        </div>
                        <div className="text-xs text-gray-300">Reach</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="p-6 bg-slate-800 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevUpdate}
                disabled={currentUpdateIndex === 0}
                className="text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-white hover:bg-white/10"
              >
                {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextUpdate}
                disabled={currentUpdateIndex === story.updates.length - 1}
                className="text-white hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-gray-400">
              {currentUpdateIndex + 1} of {story.updates.length}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentUpdateIndex(0)}
                className="text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(story)}
                className="text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">Impact Journey</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  +{story.total_impact.pointsEarned} pts
                </div>
                <div className="text-xs text-gray-300">
                  {story.total_impact.emotionalImpact}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReliveStoryViewer;
