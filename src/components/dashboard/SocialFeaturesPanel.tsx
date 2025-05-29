
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Users, Trophy, Target, MessageCircle, Heart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  icon: string;
  rarity: string;
  unlockedAt: string;
}

interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  maxParticipants: number;
  progress: number;
  maxProgress: number;
  reward: string;
  endDate: string;
  isJoined: boolean;
}

const SocialFeaturesPanel = () => {
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const [recentAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Community Champion",
      icon: "🏆",
      rarity: "epic",
      unlockedAt: "2 hours ago"
    },
    {
      id: "2",
      title: "Helping Streak",
      icon: "🔥",
      rarity: "rare",
      unlockedAt: "1 day ago"
    }
  ]);

  const [teamChallenges] = useState<TeamChallenge[]>([
    {
      id: "1",
      title: "Holiday Helper Squad",
      description: "Help 100 families during the holiday season",
      participants: 23,
      maxParticipants: 50,
      progress: 67,
      maxProgress: 100,
      reward: "Special holiday badge + 500 bonus points",
      endDate: "Dec 31, 2024",
      isJoined: true
    },
    {
      id: "2",
      title: "Emergency Response Team",
      description: "Respond to 25 emergency help requests",
      participants: 15,
      maxParticipants: 20,
      progress: 18,
      maxProgress: 25,
      reward: "Emergency Hero badge + Priority status",
      endDate: "Jan 15, 2025",
      isJoined: false
    }
  ]);

  const [socialFeed] = useState([
    {
      id: "1",
      user: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      action: "unlocked",
      achievement: "Impact Champion",
      time: "30 minutes ago",
      likes: 12,
      comments: 3
    },
    {
      id: "2",
      user: "Mike Johnson",
      avatar: "/avatars/mike.jpg",
      action: "completed",
      achievement: "Daily Helper Challenge",
      time: "2 hours ago",
      likes: 8,
      comments: 1
    }
  ]);

  const handleShareAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShareDialogOpen(true);
  };

  const handleJoinChallenge = (challengeId: string) => {
    toast({
      title: "Challenge Joined! 🎯",
      description: "You've successfully joined the team challenge. Good luck!",
    });
  };

  const handleSocialShare = (platform: string) => {
    toast({
      title: "Shared Successfully! 🎉",
      description: `Your achievement has been shared on ${platform}.`,
    });
    setShareDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Social Hub</span>
          </CardTitle>
          <CardDescription>
            Share achievements, join team challenges, and connect with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Share Achievements</TabsTrigger>
              <TabsTrigger value="challenges">Team Challenges</TabsTrigger>
              <TabsTrigger value="feed">Community Feed</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Recent Achievements</h4>
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-gray-600">Unlocked {achievement.unlockedAt}</p>
                      </div>
                      <Badge variant="outline" className={
                        achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareAchievement(achievement)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-4">
              {teamChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium">{challenge.title}</h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{challenge.participants}/{challenge.maxParticipants} members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              <span>{challenge.progress}/{challenge.maxProgress} completed</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant={challenge.isJoined ? "default" : "outline"}>
                            {challenge.isJoined ? "Joined" : "Available"}
                          </Badge>
                          <p className="text-xs text-gray-500">Ends {challenge.endDate}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round((challenge.progress / challenge.maxProgress) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="font-medium text-green-600">Reward:</p>
                          <p className="text-gray-600">{challenge.reward}</p>
                        </div>
                        {!challenge.isJoined && (
                          <Button onClick={() => handleJoinChallenge(challenge.id)}>
                            Join Challenge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="feed" className="space-y-4">
              <div className="space-y-3">
                {socialFeed.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">{item.user}</span> {item.action}{" "}
                        <span className="font-medium text-blue-600">{item.achievement}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{item.time}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-red-500">
                            <Heart className="h-4 w-4" />
                            <span>{item.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{item.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Share Achievement Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Achievement</DialogTitle>
            <DialogDescription>
              Let your friends know about your latest accomplishment!
            </DialogDescription>
          </DialogHeader>
          
          {selectedAchievement && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <span className="text-3xl">{selectedAchievement.icon}</span>
                <div>
                  <h4 className="font-medium">{selectedAchievement.title}</h4>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">
                    {selectedAchievement.rarity}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Add a message (optional)</label>
                <Textarea 
                  placeholder="Share your thoughts about this achievement..."
                  className="resize-none"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleSocialShare('Twitter')}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Share on Twitter
                </Button>
                <Button 
                  onClick={() => handleSocialShare('Facebook')}
                  className="flex-1 bg-blue-700 hover:bg-blue-800"
                >
                  Share on Facebook
                </Button>
                <Button 
                  onClick={() => handleSocialShare('LinkedIn')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialFeaturesPanel;
