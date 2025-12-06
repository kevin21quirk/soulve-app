import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, Target, Zap, Info, Calendar, TrendingUp } from "lucide-react";
import { useActivityStreak } from "@/hooks/useActivityStreak";
import { format, parseISO } from "date-fns";

interface StreakDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StreakDetailSheet = ({ open, onOpenChange }: StreakDetailSheetProps) => {
  const { streakData, milestones, nextMilestone, streakMultiplier, streakTips, loading } = useActivityStreak();

  if (loading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const currentStreak = streakData?.currentStreak || 0;
  const bestStreak = streakData?.bestStreak || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            Activity Streak
          </SheetTitle>
          <SheetDescription>
            Stay active to build your streak and earn bonus rewards
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current Streak Display */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-orange-600 mb-2">
                  {currentStreak}
                </div>
                <p className="text-lg font-medium text-orange-800">Day Streak</p>
                {streakMultiplier > 1 && (
                  <Badge className="mt-2 bg-orange-500 text-white">
                    <Zap className="h-3 w-3 mr-1" />
                    {streakMultiplier}x Points Multiplier
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Streak Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{bestStreak}</div>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{streakData?.weeklyActivity || 0}/7</div>
                <p className="text-xs text-muted-foreground">Days This Week</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Calendar */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Last 30 Days
            </h3>
            <div className="grid grid-cols-10 gap-1">
              {streakData?.activityHistory.map((day, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded ${
                    day.hasActivity 
                      ? day.activityCount > 2 
                        ? 'bg-orange-600' 
                        : day.activityCount > 1 
                          ? 'bg-orange-400' 
                          : 'bg-orange-300'
                      : 'bg-muted'
                  }`}
                  title={`${format(parseISO(day.date), 'MMM d')}: ${day.activityCount} activities, ${day.points} points`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-muted" />
                <div className="w-4 h-4 rounded bg-orange-300" />
                <div className="w-4 h-4 rounded bg-orange-400" />
                <div className="w-4 h-4 rounded bg-orange-600" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Next Milestone */}
          {nextMilestone && (
            <Card className="border-dashed border-2 border-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{nextMilestone.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{nextMilestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{nextMilestone.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{currentStreak} days</span>
                        <span>{nextMilestone.days} days</span>
                      </div>
                      <Progress value={(currentStreak / nextMilestone.days) * 100} className="h-2" />
                    </div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Reward: {nextMilestone.reward}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Milestones */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Streak Milestones
            </h3>
            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    milestone.achieved ? 'bg-green-50 border border-green-200' : 'bg-muted/50'
                  }`}
                >
                  <span className={`text-xl ${milestone.achieved ? '' : 'grayscale opacity-50'}`}>
                    {milestone.icon}
                  </span>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${milestone.achieved ? 'text-green-800' : 'text-muted-foreground'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{milestone.days} days - {milestone.reward}</p>
                  </div>
                  {milestone.achieved && (
                    <Badge className="bg-green-500 text-white text-xs">✓</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
              <Info className="h-4 w-4" />
              How to Build Your Streak
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {streakTips.map((tip, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StreakDetailSheet;
