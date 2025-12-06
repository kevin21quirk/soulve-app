import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Share2, Lock, Unlock, Star, Sparkles, Target } from "lucide-react";
import { Achievement } from "@/types/gamification";
import { getRarityColor } from "@/utils/gamificationUtils";
import { format } from "date-fns";

interface AchievementDetailModalProps {
  achievement: Achievement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare?: (achievement: Achievement) => void;
}

const AchievementDetailModal = ({ achievement, open, onOpenChange, onShare }: AchievementDetailModalProps) => {
  if (!achievement) return null;

  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
  const isAlmostComplete = progressPercent >= 80 && !achievement.unlocked;

  const getHowToComplete = (achievementId: string): string[] => {
    const tips: Record<string, string[]> = {
      first_helper: [
        "Respond to a help request in your feed",
        "Offer assistance to someone in need",
        "Complete your first community help action"
      ],
      community_champion: [
        "Consistently help people in your community",
        "Respond to help requests regularly",
        "Build your reputation as a reliable helper"
      ],
      generous_giver: [
        "Donate to campaigns you care about",
        "Support community fundraisers",
        "Every donation counts towards this goal"
      ],
      trusted_helper: [
        "Complete verifications on your profile",
        "Maintain high ratings from people you help",
        "Build a consistent track record of helping"
      ],
      social_butterfly: [
        "Connect with other community members",
        "Accept connection requests",
        "Grow your network in the community"
      ],
      week_warrior: [
        "Complete activities on 7 consecutive days",
        "Any qualifying activity counts",
        "Don't miss a day to keep your streak!"
      ],
      monthly_champion: [
        "Maintain activity for 30 consecutive days",
        "Stay consistent with your contributions",
        "Build long-term engagement habits"
      ],
      first_donation: [
        "Make your first donation to any campaign",
        "Support a cause you believe in",
        "Any amount qualifies"
      ],
      volunteer_hero: [
        "Apply for volunteer opportunities",
        "Complete volunteer commitments",
        "Log your volunteer hours"
      ],
      fundraiser_creator: [
        "Create a campaign for a cause you care about",
        "Set clear goals and share your story",
        "Rally support for your mission"
      ]
    };
    return tips[achievementId] || [
      "Complete related activities to progress",
      "Check your current stats for progress",
      "Keep engaging with the community"
    ];
  };

  const getRelatedAchievements = (achievementId: string): string[] => {
    const related: Record<string, string[]> = {
      first_helper: ["Community Champion", "Trusted Helper"],
      community_champion: ["First Helper", "Legend Helper"],
      generous_giver: ["First Donation", "Major Donor"],
      trusted_helper: ["First Helper", "Community Champion"],
      social_butterfly: ["Community Builder", "Network Legend"]
    };
    return related[achievementId] || [];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {achievement.unlocked ? (
              <Unlock className="h-5 w-5 text-green-600" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
            Achievement Details
          </DialogTitle>
          <DialogDescription>
            {achievement.unlocked ? "You've unlocked this achievement!" : "Work towards unlocking this achievement"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Achievement Header */}
          <Card className={`${achievement.unlocked ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-muted/30'}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`text-4xl p-3 rounded-full ${achievement.unlocked ? 'bg-green-100' : 'bg-muted grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      {achievement.pointsReward} points
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {achievement.progress} / {achievement.maxProgress}
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            {isAlmostComplete && (
              <div className="flex items-center gap-2 mt-2 text-sm text-orange-600">
                <Sparkles className="h-4 w-4" />
                Almost there! Just a little more to unlock!
              </div>
            )}
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-sm text-green-600 mt-2">
                Unlocked on {format(new Date(achievement.unlockedAt), 'MMMM d, yyyy')}
              </p>
            )}
          </div>

          {/* How to Complete */}
          {!achievement.unlocked && (
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Target className="h-4 w-4" />
                How to Complete
              </h4>
              <ul className="space-y-2">
                {getHowToComplete(achievement.id).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Achievements */}
          {getRelatedAchievements(achievement.id).length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Related Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {getRelatedAchievements(achievement.id).map((related, index) => (
                  <Badge key={index} variant="outline">
                    {related}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {achievement.unlocked && onShare && (
            <Button 
              onClick={() => onShare(achievement)} 
              className="w-full"
              variant="outline"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Achievement
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementDetailModal;
