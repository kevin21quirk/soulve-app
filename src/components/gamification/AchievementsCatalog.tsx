import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Heart, 
  PoundSterling, 
  Users, 
  Clock, 
  Flame,
  Star,
  Filter,
  Lock,
  Unlock,
  Sparkles
} from "lucide-react";
import { Achievement } from "@/types/gamification";
import { getRarityColor } from "@/utils/gamificationUtils";
import AchievementDetailModal from "./AchievementDetailModal";

interface AchievementsCatalogProps {
  achievements: Achievement[];
  onClaimReward?: (achievementId: string) => void;
}

type FilterType = "all" | "unlocked" | "in-progress" | "locked";
type CategoryType = "all" | "helping" | "donating" | "social" | "volunteering" | "streaks" | "trust";

const CATEGORY_CONFIG: Record<CategoryType, { icon: React.ReactNode; label: string; color: string }> = {
  all: { icon: <Trophy className="h-4 w-4" />, label: "All", color: "text-primary" },
  helping: { icon: <Heart className="h-4 w-4" />, label: "Helping", color: "text-red-500" },
  donating: { icon: <PoundSterling className="h-4 w-4" />, label: "Donating", color: "text-green-500" },
  social: { icon: <Users className="h-4 w-4" />, label: "Social", color: "text-blue-500" },
  volunteering: { icon: <Clock className="h-4 w-4" />, label: "Volunteering", color: "text-purple-500" },
  streaks: { icon: <Flame className="h-4 w-4" />, label: "Streaks", color: "text-orange-500" },
  trust: { icon: <Star className="h-4 w-4" />, label: "Trust", color: "text-yellow-500" }
};

const getAchievementCategory = (achievementId: string): CategoryType => {
  if (achievementId.includes('helper') || achievementId.includes('help')) return 'helping';
  if (achievementId.includes('donation') || achievementId.includes('donor') || achievementId.includes('giver')) return 'donating';
  if (achievementId.includes('connection') || achievementId.includes('social') || achievementId.includes('butterfly')) return 'social';
  if (achievementId.includes('volunteer')) return 'volunteering';
  if (achievementId.includes('streak')) return 'streaks';
  if (achievementId.includes('trust') || achievementId.includes('verified')) return 'trust';
  return 'helping';
};

const AchievementsCatalog = ({ achievements, onClaimReward }: AchievementsCatalogProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [category, setCategory] = useState<CategoryType>("all");
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const filteredAchievements = achievements.filter(achievement => {
    // Apply status filter
    if (filter === "unlocked" && !achievement.unlocked) return false;
    if (filter === "in-progress" && (achievement.unlocked || achievement.progress === 0)) return false;
    if (filter === "locked" && (achievement.unlocked || achievement.progress > 0)) return false;
    
    // Apply category filter
    if (category !== "all" && getAchievementCategory(achievement.id) !== category) return false;
    
    return true;
  });

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    inProgress: achievements.filter(a => !a.unlocked && a.progress > 0).length,
    locked: achievements.filter(a => !a.unlocked && a.progress === 0).length
  };

  const getCategoryStats = (cat: CategoryType) => {
    const catAchievements = cat === "all" 
      ? achievements 
      : achievements.filter(a => getAchievementCategory(a.id) === cat);
    return {
      total: catAchievements.length,
      unlocked: catAchievements.filter(a => a.unlocked).length
    };
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setDetailModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Achievement Catalog</span>
            </div>
            <Badge variant="secondary" className="text-sm">
              {stats.unlocked}/{stats.total} Unlocked
            </Badge>
          </CardTitle>
          <CardDescription>
            Explore all achievements and track your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.unlocked / stats.total) * 100)}%
              </span>
            </div>
            <Progress value={(stats.unlocked / stats.total) * 100} className="h-3" />
            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <Unlock className="h-4 w-4 text-green-500" />
                <span>{stats.unlocked} Unlocked</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span>{stats.inProgress} In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>{stats.locked} Locked</span>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={category} onValueChange={(v) => setCategory(v as CategoryType)}>
            <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {(Object.keys(CATEGORY_CONFIG) as CategoryType[]).map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                const catStats = getCategoryStats(cat);
                return (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="flex items-center gap-1.5 data-[state=active]:bg-background"
                  >
                    <span className={config.color}>{config.icon}</span>
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="text-xs text-muted-foreground">
                      ({catStats.unlocked}/{catStats.total})
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {(["all", "unlocked", "in-progress", "locked"] as FilterType[]).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "default" : "ghost"}
                  onClick={() => setFilter(f)}
                  className="text-xs"
                >
                  {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Achievement Grid */}
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No achievements match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredAchievements.map((achievement) => {
                const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
                const isAlmostComplete = progressPercent >= 80 && !achievement.unlocked;
                
                return (
                  <div
                    key={achievement.id}
                    onClick={() => handleAchievementClick(achievement)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      achievement.unlocked 
                        ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
                        : isAlmostComplete
                          ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800'
                          : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`text-2xl p-2 rounded-full ${
                        achievement.unlocked 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-muted grayscale'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">{achievement.title}</h4>
                          {achievement.unlocked && (
                            <Unlock className="h-3 w-3 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`${getRarityColor(achievement.rarity)} text-xs`}>
                            {achievement.rarity}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {achievement.pointsReward}
                          </Badge>
                        </div>
                        
                        {!achievement.unlocked && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-1.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AchievementDetailModal
        achievement={selectedAchievement}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </>
  );
};

export default AchievementsCatalog;
